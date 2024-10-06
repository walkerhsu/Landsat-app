# import math

from typing import List
import ee
from ee import Image
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request


COLLECTIONS = [
    "LANDSAT/LC08/C02/T1_TOA",
    "LANDSAT/LC09/C02/T1_TOA",
    "LANDSAT/LC08/C02/T1_L2",
    "LANDSAT/LC09/C02/T1_L2",
]

class LandsatGridAnalyzer:
    def __init__(self, service_account_key):
        self.service_account_key = service_account_key
        self.initialize_ee()

    def initialize_ee(self):
        credentials = Credentials.from_service_account_file(
            self.service_account_key,
            scopes=["https://www.googleapis.com/auth/earthengine"],
        )
        credentials.refresh(Request())
        ee.Initialize(credentials)

    def process_collection(self, collection, collection_name):
        def process_image(image):
            return ee.Feature(
                None,
                {
                    "id": image.id(),
                    "acquisition_date": ee.Date(image.get("system:time_start")).format(
                        "YYYY-MM-dd"
                    ),
                    "acquisition_time": image.get("SCENE_CENTER_TIME"),
                    "collection": collection.get("system:id"),
                    "collection_name": collection_name,
                    "WRS_ROW": image.get("WRS_ROW"),
                    "WRS_PATH": image.get("WRS_PATH"),
                },
            )

        return collection.map(process_image)

    def get_datasetIDs(self, start_date, end_date):
        # print(start_date, end_date)
        # start_date = "2024-09-29T00:00:00"
        # end_date = "2024-10-05T00:00:00"
        collections = [
            ee.ImageCollection(collection_name)
            .filter(ee.Filter.metadata_('system:time_end', 'greater_than', ee.Date(start_date).millis()))
            .filter(ee.Filter.metadata_('system:time_end', 'less_than', ee.Date(end_date).millis()))
            for collection_name in COLLECTIONS
        ]

        all_features = ee.FeatureCollection([])
        for collection, collection_name in zip(collections, COLLECTIONS):
            features = self.process_collection(collection, collection_name)
            all_features = all_features.merge(features)

        result = all_features.getInfo()
        dataset_list = []
        for feature in result["features"]:
            props = feature["properties"]
            collection_name = props["collection"]
            acquisition_time = props["acquisition_time"][:8]
            landsat_id = props["collection_name"].split("/")[1][-1]
            dataset_list.append(
                {
                    "id": f"{props['collection_name']}/{props['id']}",
                    "landsat_id": landsat_id,
                    "acquisition_date": props["acquisition_date"],
                    "acquisition_time": acquisition_time,
                    "WRS_ROW": props["WRS_ROW"],
                    "WRS_PATH": props["WRS_PATH"],
                }
            )

        return dataset_list
