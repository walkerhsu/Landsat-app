import math
import ee
from ee import Image
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request
from pyproj import Transformer, CRS

SERVICE_ACCOUNT_KEY = './earth-engine-SA-key.json'

class LandsatGridAnalyzer:
    def __init__(self, center_lat, center_lon, start_date, end_date, pixel_size=30, service_account_key=SERVICE_ACCOUNT_KEY):
        self.center_lat = center_lat
        self.center_lon = center_lon
        self.start_date = start_date
        self.end_date = end_date
        self.pixel_size = pixel_size
        self.pixel_coordinates = []
        self.pixel_corners = []
        self.service_account_key = service_account_key
        self.initialize_ee()

    def initialize_ee(self):
        credentials = Credentials.from_service_account_file(
            self.service_account_key,
            scopes=['https://www.googleapis.com/auth/earthengine']
        )
        credentials.refresh(Request())
        ee.Initialize(credentials)
        self.center_point = ee.Geometry.Point(self.center_lon, self.center_lat)
        self.neighborhood = self.center_point.buffer(self.pixel_size*1.5).bounds()
        
        # Set up transformers
        wgs84 = CRS.from_epsg(4326)
        web_mercator = CRS.from_epsg(3857)
        self.wgs84_to_web_mercator = Transformer.from_crs(wgs84, web_mercator, always_xy=True)
        self.web_mercator_to_wgs84 = Transformer.from_crs(web_mercator, wgs84, always_xy=True)

        # Calculate pixel coordinates
        center_x, center_y = self.wgs84_to_web_mercator.transform(self.center_lon, self.center_lat)
        for y in range(-1, 2):
            for x in range(-1, 2):
                pixel_center_x = center_x + (x * self.pixel_size)
                pixel_center_y = center_y + (y * self.pixel_size)
                lon, lat = self.web_mercator_to_wgs84.transform(pixel_center_x, pixel_center_y)
                self.pixel_coordinates.append((lat, lon))

                corners = []
                for dy, dx in [(-0.5, -0.5), (-0.5, 0.5), (0.5, -0.5), (0.5, 0.5)]:
                    corner_x = pixel_center_x + (dx * self.pixel_size)
                    corner_y = pixel_center_y + (dy * self.pixel_size)
                    lon, lat = self.web_mercator_to_wgs84.transform(corner_x, corner_y)
                    corners.append((lat, lon))

                self.pixel_corners.append({
                    "top_left": corners[0],
                    "top_right": corners[1],
                    "bottom_left": corners[2],
                    "bottom_right": corners[3]
                })

    def calculate_rgb_for_collection(self, scene: Image):
        SR_data = []
        bands = ["SR_B4", "SR_B3", "SR_B2", "SR_B5", "SR_B6"]  # Red, Green, Blue, NIR, SWIR
        scene_bands = scene.select(bands)
        for i, (lat, lon) in enumerate(self.pixel_coordinates):
            point = ee.Geometry.Point(lon, lat)
            
            values = scene_bands.reduceRegion(
                geometry=point,
                reducer=ee.Reducer.mean(),
                scale=1,  # Landsat resolution
                tileScale=16
            ).getInfo()

            date = ee.Date(scene.get('system:time_start')).format('YYYY-MM-dd').getInfo()

            red = values['SR_B4']
            green = values['SR_B3']
            blue = values['SR_B2']
            nir = values['SR_B5']
            swir = values['SR_B6']

            print(f"({lat:.6f}, {lon:.6f}) : Red={red}, Green={green}, Blue={blue}, NIR={nir}, SWIR={swir}")

            # Apply custom processing
            green = 0.5 * green + 0.5 * nir
            blue = 0.5 * blue + 0.5 * swir

            # Normalize to 0-255 range
            max_value = 65535
            gamma = 1.5
            red = int(((red / max_value) ** (1 / gamma)) * 255)
            green = int(((green / max_value) ** (1 / gamma)) * 255)
            blue = int(((blue / max_value) ** (1 / gamma)) * 255)

            hex_color = f"#{red:02x}{green:02x}{blue:02x}"

            SR_data.append({
                "date": date,
                "lat": lat,
                "lon": lon,
                "top_left": self.pixel_corners[i]["top_left"],
                "top_right": self.pixel_corners[i]["top_right"],
                "bottom_left": self.pixel_corners[i]["bottom_left"],
                "bottom_right": self.pixel_corners[i]["bottom_right"],
                "hex_color": hex_color
            })

        return SR_data

    def analyze_grid(self):
        date_analysis = []

        collection = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2") \
            .filterBounds(self.center_point) \
            .filterDate(self.start_date, self.end_date) \
            .sort("system:time_start")
        
        image_list = collection.toList(collection.size())
        size = image_list.size().getInfo()

        print(f"Size: {size}")
        for i in range(size):
            scene = ee.Image(image_list.get(i))

            SR_data = self.calculate_rgb_for_collection(scene)
            date_analysis.append(SR_data)

        return date_analysis


# Example usage
if __name__ == "__main__":
    start_date = '2024-09-01'
    end_date = '2024-09-30'
    analyzer = LandsatGridAnalyzer(24.425069020272804, 120.99891581643367, start_date, end_date)
    results = analyzer.analyze_grid()

    for result in results:
        for pixel in result:
            print(f"Lat={pixel['lat']}, Lon={pixel['lon']}, Color={pixel['hex_color']}")
            print(f"Corners: \n{pixel['top_left']}\n{pixel['top_right']}\n{pixel['bottom_left']}\n{pixel['bottom_right']}")
        print("-"*100)
