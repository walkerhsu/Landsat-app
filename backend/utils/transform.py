import geopandas as gpd
from shapely.geometry import Point

def Latlng2WRS2(latitude, longitude):
    """
    Get the WRS path and row for a given longitude and latitude.
    
    Args:
        latitude (float): The latitude of the point.
        longitude (float): The longitude of the point.
    
    Returns:
        [PATH, ROW] (numpy.ndarray): The WRS path and row.
    """
    try:
        wrs_shapefile = './WRS2_descending_0/WRS2_descending.shp'
        wrs_gdf = gpd.read_file(wrs_shapefile)
        point = gpd.GeoDataFrame(geometry=[Point(longitude, latitude)], crs='EPSG:4326')
        wrs_path_row = gpd.sjoin(point, wrs_gdf, how='left', predicate='within')
        path, row = wrs_path_row[['PATH', 'ROW']].values[0]
        return [path, row]
    except:
        try:
            wrs_shapefile = './WRS2_ascending_0/WRS2_ascending.shp'
            wrs_gdf = gpd.read_file(wrs_shapefile)
            point = gpd.GeoDataFrame(geometry=[Point(longitude, latitude)], crs='EPSG:4326')
            wrs_path_row = gpd.sjoin(point, wrs_gdf, how='left', predicate='within')
            path, row = wrs_path_row[['PATH', 'ROW']].values[0]
            return [path, row]
        except:
            raise ValueError("Tile not found for the given Latitude/Longitude.")
    
def WRS22LatLng(path, row):
    """
    Get the latitude and longitude for a given WRS path and row.
    
    Args:
        path (int): The WRS path.
        row (int): The WRS row.
    
    Returns:
        [latitude, longitude] (numpy.ndarray): The latitude and longitude.
    """
    shapefile_path = [
        'WRS2_descending_0/WRS2_descending.shp',
        'WRS2_ascending_0/WRS2_ascending.shp'
    ]
    
    gdf = gpd.read_file(shapefile_path[0])
    tile = gdf[(gdf['PATH'] == path) & (gdf['ROW'] == row)]
    
    if tile.empty:
        gdf = gpd.read_file(shapefile_path[1])
        tile = gdf[(gdf['PATH'] == path) & (gdf['ROW'] == row)]
        if tile.empty:
            raise ValueError("Tile not found for the given Path/Row.")
    
    tile_projected = tile.to_crs(epsg=3857)
    centroid_projected = tile_projected.geometry.centroid.iloc[0]
    centroid_geographic = gpd.GeoSeries([centroid_projected], crs=tile_projected.crs).to_crs(epsg=4326).iloc[0]
    lat, lng = centroid_geographic.y, centroid_geographic.x
    return [lat, lng]

if __name__ == '__main__':
    print(WRS22LatLng(117, 43))
    print(Latlng2WRS2(24.8020, 121.4484))