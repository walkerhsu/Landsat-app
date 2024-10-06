# import math
import asyncio
import math
import queue
from typing import List
import ee
from ee import Image
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request
from pyproj import Transformer, CRS
from user_data import CloudCoverage, Feature, Geometry, LatLng, GeoJson
from constants import COLLECTIONS, L2_BANDS



class LandsatGridAnalyzer:
    def __init__(self, pixel_size, service_account_key):
        self.default_pixel_size = pixel_size
        self.pixel_coordinates = []
        self.pixel_corners = []
        self.memory_cache = {}
        self.memory_cache_size = 1000
        self.cache_queue = queue.Queue(self.memory_cache_size)
        self.service_account_key = service_account_key
        self.initialize_ee()

    def initialize_ee(self):
        credentials = Credentials.from_service_account_file(
            self.service_account_key,
            scopes=["https://www.googleapis.com/auth/earthengine"],
        )
        credentials.refresh(Request())
        ee.Initialize(credentials)

    def get_cache_key(self, datasetID, center: LatLng):
        return f"{datasetID}_{center.lat}_{center.lng}"
    
    def put_cache_element(self, cache_key, all_SR_data):
        self.memory_cache[cache_key] = all_SR_data
        if self.cache_queue.qsize() > self.memory_cache_size:
            old_data = self.cache_queue.get()
            def removekey(d, key):
                r = dict(d)
                del r[key]
                return r
            self.memory_cache = removekey(self.memory_cache, old_data)

    def process_all_corners(
        self, collection_name, parsed_location: LatLng
    ) -> GeoJson:
        tasks = self.get_corners(collection_name, parsed_location)
        return tasks
    
    def get_image_info(self, image):
        first_band = ee.List([image.bandNames().get(0)])
        single_band_image = image.select(first_band)
        proj = single_band_image.projection()
        return ee.Feature(
            None,
            {"crs": proj.crs(), "scale": proj.nominalScale()},
        )

    def get_corners(self, datasetID, parsed_location: LatLng):
        image = ee.Image(datasetID)

        image_data = self.get_image_info(image).getInfo()
        # Calculate 9 grid corners
        grid_corners, centers = self.calculate_grid_corners(
            image_data["properties"], parsed_location
        )
        print(grid_corners)
        features = []
        all_SR_data = []
        is_cached = False
        cache_key = self.get_cache_key(datasetID, parsed_location)
        if cache_key in self.memory_cache:
            is_cached = True

        for idx, (center, grid_corner) in enumerate(zip(centers, grid_corners)):
            if is_cached:
                SR_data = self.memory_cache[cache_key][idx]
            else:
                SR_data = self.get_pixel_data(datasetID, center[0], center[1])
                all_SR_data.append(SR_data)
            features.append(Feature(
                type="Feature",
                properties={"SR_data": SR_data},
                geometry=Geometry(type="Polygon", coordinates=[grid_corner]),
            ))
        if not is_cached:
            self.put_cache_element(cache_key, all_SR_data)
        
        # create the geojson with 9 corners
        geojson = GeoJson(
            type="FeatureCollection",
            features=features
        )
        return geojson
    
    def calculate_9_centers(self, image_props, center: LatLng):
        # Convert center to image CRS
        image_crs = CRS.from_string(image_props["crs"])
        wgs84 = CRS.from_epsg(4326)
        image_to_wgs84 = Transformer.from_crs(image_crs, wgs84, always_xy=True)
        wgs84_to_image = Transformer.from_crs(wgs84, image_crs, always_xy=True)
        pixel_size = image_props.get("scale", self.default_pixel_size)
        center_x, center_y = wgs84_to_image.transform(center.lng, center.lat)
        centers = []
        for y in range(-1, 2):
            for x in range(-1, 2):
                pixel_center_x = center_x + (x * pixel_size)
                pixel_center_y = center_y + (y * pixel_size)
                center_lon, center_lat = image_to_wgs84.transform(pixel_center_x, pixel_center_y)
                centers.append([center_lat, center_lon])
        return center_x, center_y, centers, pixel_size, image_to_wgs84

    def calculate_grid_corners(self, image_props, center: LatLng):
        # Create transformers based on the image CRS
        center_x, center_y, centers, pixel_size, image_to_wgs84 = self.calculate_9_centers(image_props, center)

        grid_corners = []
        for y in range(-1, 2):
            for x in range(-1, 2):
                pixel_center_x = center_x + (x * pixel_size)
                pixel_center_y = center_y + (y * pixel_size)
                corners = []
                for dy, dx in [(-0.5, -0.5), (-0.5, 0.5), (0.5, 0.5), (0.5, -0.5)]:
                    corner_x = pixel_center_x + (dx * pixel_size)
                    corner_y = pixel_center_y + (dy * pixel_size)
                    lon, lat = image_to_wgs84.transform(corner_x, corner_y)
                    corners.append([lon, lat])
                corners.append(corners[0])

                grid_corners.append(corners)

        return grid_corners, centers

    def process_collection(self, collection, collection_name):
        def process_image(image):
            return ee.Feature(
                None,
                {
                    "id": image.id(),
                    "date": ee.Date(image.get("system:time_start")).format(
                        "YYYY-MM-dd"
                    ),
                    "collection": collection.get("system:id"),
                    "collection_name": collection_name,
                    "cloud_cover": image.get("CLOUD_COVER"),
                },
            )

        return collection.map(process_image)

    async def get_dataset(self, lat, lng, start_date, end_date, cloud_coverage: CloudCoverage):
        center_point = ee.Geometry.Point(lng, lat)
        collections = [
            ee.ImageCollection(collection_name)
            .filterBounds(center_point)
            .filterDate(start_date, end_date)
            .filter(ee.Filter.lte("CLOUD_COVER", cloud_coverage.max))
            .filter(ee.Filter.gte("CLOUD_COVER", cloud_coverage.min))
            .sort("system:time_start")
            for collection_name in COLLECTIONS
        ]

        all_features = ee.FeatureCollection([])
        for collection, collection_name in zip(collections, COLLECTIONS):
            features = self.process_collection(collection, collection_name)
            all_features = all_features.merge(features)

        result = all_features.getInfo()

        dataset_list = [
            {
                "collection_name": collection_name,
                "location": {"lat": lat, "lng": lng},
                "dataset_id": [],
            }
            for collection_name in COLLECTIONS
        ]
        for feature in result["features"]:
            props = feature["properties"]
            collection_name = props["collection"]
            for dataset in dataset_list:
                if dataset["collection_name"] == collection_name:
                    dataset["dataset_id"].append(
                        {
                            "id": f"{props['collection_name']}/{props['id']}",
                            "date": props["date"],
                            "cloud_cover": props["cloud_cover"],
                        }
                    )
                    break

        return dataset_list

    async def process_all_locations(self, locations, start_date, end_date, cloud_coverage):
        tasks = []
        for loc in locations:
            tasks.extend(await self.get_dataset(loc.lat, loc.lng, start_date, end_date, cloud_coverage))

        return tasks

    def get_pixel_data(self, datasetID, lat, lon):
        scene_bands = ee.Image(datasetID).select(L2_BANDS)
        point = ee.Geometry.Point(lon, lat)
        band_values = scene_bands.reduceRegion(
            geometry=point, reducer=ee.Reducer.mean(), scale=1, tileScale=16
        ).getInfo()
        blue = band_values["SR_B2"]
        green = band_values["SR_B3"]
        red = band_values["SR_B4"]
        nir = band_values["SR_B5"]
        swir = band_values["SR_B6"]
        swir2 = band_values["SR_B7"]
        tirs1 = band_values["ST_B10"]
        temp = self.get_temp_data(tirs1)
        SR_data = {
            "color": self.get_RGB_data(red, green, blue, nir, swir),
            "ndvi": self.get_ndvi(nir, red),
            "ndwi": self.get_ndwi(nir, swir),
            "evi": self.get_evi(nir, red, blue),
            "savi": self.get_savi(nir, red, blue),
            "ndmi": self.get_ndmi(nir, swir),
            "nbr": self.get_nbr(nir, swir2),
            "nbr2": self.get_nbr2(swir, swir2),
            "ndsi": self.get_ndsi(green, swir),
            "temperature": temp
        }
        return SR_data

    def download_dataset(self, datasetID, location: LatLng):
        cache_key = self.get_cache_key(datasetID, location)
        if cache_key in self.memory_cache:
            return self.memory_cache[cache_key]

        image = ee.Image(datasetID)
        image_data = self.get_image_info(image).getInfo()

        _, _, centers, _, _ = self.calculate_9_centers(image_data["properties"], location)
        all_SR_data = []
        for center in centers:
            all_SR_data.append(self.get_pixel_data(datasetID, center[0], center[1]))
        self.put_cache_element(cache_key, all_SR_data)
        return all_SR_data

    def get_RGB_data(self, red, green, blue, nir, swir):
        # Apply custom processing
        green = 0.5 * green + 0.5 * nir
        blue = 0.5 * blue + 0.5 * swir

        # Normalize to 0-255 range
        max_value = 65455
        gamma = 1.5
        red = int(((red / max_value) ** (1 / gamma)) * 255)
        green = int(((green / max_value) ** (1 / gamma)) * 255)
        blue = int(((blue / max_value) ** (1 / gamma)) * 255)
        return f"#{red:02x}{green:02x}{blue:02x}"

    def get_ndvi(self, nir, red):
        return (nir - red) / (nir + red)

    def get_ndwi(self, nir, swir):
        return (nir - swir) / (nir + swir)

    def get_evi(self, nir, red, blue):
        return 2.5 * (nir - red) / (nir + 6 * red - 7.5 * blue + 1)

    def get_savi(self, nir, red, blue):
        return ((nir - red) / (nir + red + 0.5)) * 1.5

    def get_ndmi(self, nir, swir):
        return (nir - swir) / (nir + swir)

    def get_nbr(self, nir, swir2):
        return (nir - swir2) / (nir + swir2)

    def get_nbr2(self, swir, swir2):
        return (swir - swir2) / (swir + swir2)

    def get_ndsi(self, green, swir):
        return (green - swir) / (green + swir)

    def get_temp_data(self, st_b10):
        if st_b10 is not None and st_b10 != 0:  # Check for valid data
            return st_b10 * 0.00341802 + 149.0  # Scale factor and offset
        return 0.0
