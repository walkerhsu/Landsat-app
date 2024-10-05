# import math
import asyncio
import math
from typing import List
import ee
from ee import Image
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request
from pyproj import Transformer, CRS
from user_data import Feature, Geometry, LatLng, GeoJson
from constants import COLLECTIONS, COLLECTION_2_BANDS, L2_BANDS, TOA_BANDS


class LandsatGridAnalyzer:
    def __init__(self, pixel_size, service_account_key):
        self.default_pixel_size = pixel_size
        self.pixel_coordinates = []
        self.pixel_corners = []
        self.service_account_key = service_account_key
        self.initialize_ee()

    def initialize_ee(self):
        credentials = Credentials.from_service_account_file(
            self.service_account_key,
            scopes=["https://www.googleapis.com/auth/earthengine"],
        )
        credentials.refresh(Request())
        ee.Initialize(credentials)

    async def process_all_corners(
        self, collection_name, parsed_locations: List[LatLng]
    ) -> List[GeoJson]:
        tasks = [
            self.get_corners(collection_name, location) for location in parsed_locations
        ]
        return await asyncio.gather(*tasks)

    async def get_corners(self, collection_name, parsed_location: LatLng):
        center_point = ee.Geometry.Point(parsed_location.lng, parsed_location.lat)
        image = ee.ImageCollection(collection_name).filterBounds(center_point).first()

        def get_image_info(image):
            proj = image.projection()
            return ee.Feature(
                None,
                {"crs": proj.crs().getInfo(), "scale": proj.nominalScale().getInfo()},
            )

        image_data = get_image_info(image).getInfo()

        # Calculate 9 grid corners
        grid_corners = self.calculate_grid_corners(
            image_data["properties"], parsed_location
        )
        # create the geojson with 9 corners
        geojson = GeoJson(
            type="FeatureCollection",
            features=[
                Feature(
                    type="Feature",
                    properties={"lat": parsed_location.lat, "lng": parsed_location.lng},
                    geometry=Geometry(type="Polygon", coordinates=grid_corners),
                )
            ],
        )
        return geojson

    def calculate_grid_corners(self, image_props, center: LatLng):
        # Create transformers based on the image CRS
        image_crs = CRS.from_string(image_props["crs"])
        wgs84 = CRS.from_epsg(4326)
        image_to_wgs84 = Transformer.from_crs(image_crs, wgs84, always_xy=True)
        wgs84_to_image = Transformer.from_crs(wgs84, image_crs, always_xy=True)

        # Convert center to image CRS
        center_x, center_y = wgs84_to_image.transform(center.lng, center.lat)

        # Get pixel size
        pixel_size = image_props.get("scale", self.default_pixel_size)

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
                    corners.append([lat, lon])
                corners.append(corners[0])

                grid_corners.append(corners)

        return grid_corners
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

    async def get_dataset(self, lat, lng, start_date, end_date):
        center_point = ee.Geometry.Point(lng, lat)
        collections = [
            ee.ImageCollection(collection_name)
            .filterBounds(center_point)
            .filterDate(start_date, end_date)
            .sort("system:time_start")
            for collection_name in COLLECTIONS
        ]

        all_features = ee.FeatureCollection([])
        for collection, collection_name in zip(collections, COLLECTIONS):
            features = self.process_collection(collection, collection_name)
            all_features = all_features.merge(features)

        result = all_features.getInfo()

        dataset_list = [
            {"collection_name": collection_name, "dataset_id": []}
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

    async def process_all_locations(self, locations, start_date, end_date):
        tasks = [
            self.get_dataset(loc.lat, loc.lng, start_date, end_date)
            for loc in locations
        ]
        return await asyncio.gather(*tasks)

    def get_pixel_data(self, datasetID, lat, lon):
        bands = []
        for collection in COLLECTION_2_BANDS.keys():
            if collection in datasetID:
                bands = COLLECTION_2_BANDS[collection]
                break
        scene_bands = ee.Image(datasetID).select(bands)
        point = ee.Geometry.Point(lon, lat)
        band_values = scene_bands.reduceRegion(
            geometry=point, reducer=ee.Reducer.mean(), scale=1, tileScale=16
        ).getInfo()
        if bands == L2_BANDS:
            print("L2 Bands")
            blue = band_values["SR_B2"]
            green = band_values["SR_B3"]
            red = band_values["SR_B4"]
            nir = band_values["SR_B5"]
            swir = band_values["SR_B6"]
            swir2 = band_values["SR_B7"]
            tirs1 = band_values["ST_B10"]
            temp = self.get_temp_data(tirs1)
        elif bands == TOA_BANDS:
            print("TOA Bands")
            max_value = 65535
            blue = band_values["B2"] * max_value
            green = band_values["B3"] * max_value
            red = band_values["B4"] * max_value
            nir = band_values["B5"] * max_value
            swir = band_values["B6"] * max_value
            swir2 = band_values["B7"] * max_value
            temp = None
        else:
            print("No bands found")
        print(red, green, blue, nir, swir)
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
    
    def download_datasets(self, datasetIDs, lat, lng):
        SR_data = []
        for datasetID in datasetIDs:
            SR_data.append({
                "lat": lat,
                "lng": lng,
                "SR_data": self.get_pixel_data(datasetID, lat, lng)
            })
        return SR_data

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

        return {"red": red, "green": green, "blue": blue}

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
            return (st_b10 * 0.00341802 + 149.0)  # Scale factor and offset
        return 0.0
