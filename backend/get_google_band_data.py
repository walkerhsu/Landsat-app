import ee
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import Request
import json

# Path to your service account key file
SERVICE_ACCOUNT_KEY = './landsat-437601-831b4a3a9231.json'

# Function to initialize Earth Engine with service account
def initialize_ee():
    credentials = Credentials.from_service_account_file(
        SERVICE_ACCOUNT_KEY,
        scopes=['https://www.googleapis.com/auth/earthengine']
    )
    credentials.refresh(Request())
    ee.Initialize(credentials)

# Initialize Earth Engine
initialize_ee()

# Define the point of interest
center_point = ee.Geometry.Point(120.99891581643367, 24.425069020272804)

# Create a slightly larger neighborhood around the center point
neighborhood = center_point.buffer(50).bounds()

# Define the date range
start_date = '2024-09-01'
end_date = '2024-09-30'

# Load Landsat 9 collection
collection = ee.ImageCollection('LANDSAT/LC09/C02/T1_L2') \
    .filterBounds(center_point) \
    .filterDate(start_date, end_date) \
    .sort('system:time_start')  # Sort by acquisition date

# Function to process a single image
def process_image(image):
    # Select the bands we're interested in
    bands = ['SR_B4', 'SR_B3', 'SR_B2', 'SR_B5', 'SR_B6']  # Red, Green, Blue, NIR, SWIR
    image = image.select(bands)

    # Get the pixel values for the neighborhood
    values = image.reduceRegion(
        reducer=ee.Reducer.toList(),
        geometry=neighborhood,
        scale=30,  # Landsat resolution
        tileScale=16
    ).getInfo()

    # Get the acquisition date
    date = ee.Date(image.get('system:time_start')).format('YYYY-MM-dd').getInfo()

    return date, values

# Process all images in the collection
image_list = collection.toList(collection.size())
size = image_list.size().getInfo()

for i in range(size):
    image = ee.Image(image_list.get(i))
    date, values = process_image(image)
    
    print(f"\nScene {i+1} - Date: {date}")
    print("RGB values for neighborhood points:")
    num_pixels = len(values['SR_B4'])
    for j in range(num_pixels):
        red = values['SR_B4'][j]
        green = values['SR_B3'][j]
        blue = values['SR_B2'][j]
        nir = values['SR_B5'][j]
        swir = values['SR_B6'][j]

        # Apply your custom processing
        green = 0.5 * green + 0.5 * nir
        blue = 0.5 * blue + 0.5 * swir

        # Normalize to 0-255 range (assuming 16-bit data)
        max_value = 65535
        red = int((red / max_value) * 255)
        green = int((green / max_value) * 255)
        blue = int((blue / max_value) * 255)

        # Apply gamma correction
        gamma = 1.5
        red = int(((red / 255) ** (1/gamma)) * 255)
        green = int(((green / 255) ** (1/gamma)) * 255)
        blue = int(((blue / 255) ** (1/gamma)) * 255)

        hex_color = '#{:02x}{:02x}{:02x}'.format(red, green, blue)
        print(f"Pixel {j}: R:{red}, G:{green}, B:{blue} - Hex: {hex_color}")

    # Process the center-most pixel (assuming it's the middle of the list)
    center_index = num_pixels // 2
    print(f"\nCenter pixel (index {center_index}):")
    red = values['SR_B4'][center_index]
    green = values['SR_B3'][center_index]
    blue = values['SR_B2'][center_index]
    nir = values['SR_B5'][center_index]
    swir = values['SR_B6'][center_index]

    # Apply your custom processing for the center pixel
    green = 0.5 * green + 0.5 * nir
    blue = 0.5 * blue + 0.5 * swir

    # Normalize to 0-255 range (assuming 16-bit data)
    max_value = 65535
    red = int((red / max_value) * 255)
    green = int((green / max_value) * 255)
    blue = int((blue / max_value) * 255)

    # Apply gamma correction
    gamma = 1.5
    red = int(((red / 255) ** (1/gamma)) * 255)
    green = int(((green / 255) ** (1/gamma)) * 255)
    blue = int(((blue / 255) ** (1/gamma)) * 255)

    print(f"RGB values for coordinates (24.02213, 121.5000):")
    print(f"Red: {red}")
    print(f"Green: {green}")
    print(f"Blue: {blue}")

    hex_color = '#{:02x}{:02x}{:02x}'.format(red, green, blue)
    print(f"Hex color code: {hex_color}")