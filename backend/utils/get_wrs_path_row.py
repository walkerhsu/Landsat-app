import geopandas as gpd
from shapely.geometry import Point

def get_wrs_path_row(latitude, longitude):
    """
    Get the WRS path and row for a given longitude and latitude.
    
    Args:
        latitude (float): The latitude of the point.
        longitude (float): The longitude of the point.
    
    Returns:
        [PATH, ROW] (numpy.ndarray): The WRS path and row.
    """
    # Load the WRS-2 shapefile
    wrs_shapefile = './WRS2_descending_0/WRS2_descending.shp'
    wrs_gdf = gpd.read_file(wrs_shapefile)
    # Create a GeoDataFrame with the point (longitude, latitude)
    point = gpd.GeoDataFrame(geometry=[Point(longitude, latitude)], crs='EPSG:4326')

    # Perform a spatial join to find the WRS path/row
    wrs_path_row = gpd.sjoin(point, wrs_gdf, how='left', predicate='within')

    return wrs_path_row[['PATH', 'ROW']].values[0]

if __name__ == '__main__':
    print(get_wrs_path_row(24.8020, 121.4484))