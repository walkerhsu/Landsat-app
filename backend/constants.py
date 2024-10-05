SERVICE_ACCOUNT_KEY = './secret/earth-engine-SA-key.json'
PIXEL_SIZE = 30
COLLECTIONS = [
    "LANDSAT/LC08/C02/T1_TOA",
    "LANDSAT/LC09/C02/T1_TOA",
    "LANDSAT/LC08/C02/T1_L2",
    "LANDSAT/LC09/C02/T1_L2",
]

L2_BANDS = [
    # "SR_B1",
    "SR_B2",
    "SR_B3",
    "SR_B4",
    "SR_B5",
    "SR_B6",
    "SR_B7",
    "ST_B10",
    # "ST_ATRAN",
    # "ST_CDIST",
    # "ST_DRAD",
    # "ST_EMIS",
    # "ST_EMSD",
    # "ST_QA",
    # "ST_TRAD",
]

TOA_BANDS = [
    # "B1",
    "B2",
    "B3",
    "B4",
    "B5",
    "B6",
    "B7",
    # "B8",
    # "B9",
    "B10",
    # "B11",
]

COLLECTION_2_BANDS = {
    "LANDSAT/LC08/C02/T1_TOA": TOA_BANDS,
    "LANDSAT/LC09/C02/T1_TOA": TOA_BANDS,
    "LANDSAT/LC08/C02/T1_L2": L2_BANDS,
    "LANDSAT/LC09/C02/T1_L2": L2_BANDS,
}
