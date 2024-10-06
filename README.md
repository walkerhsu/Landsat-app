# Earth Pixel X

We are Earth Pixel, a web app for you to dive into each pixel of landsat data!

project link: https://nasa-landsat-app-194107554494.asia-east1.run.app/

## Key Functions
### 1. Landsat Data Acquisition Options
Data Selection Panel: Users can select Landsat Surface Reflectance (SR) data, which updates automatically every 6 hours.
Settings: Includes a scrolling cloud coverage threshold and a calendar feature to filter for recent data or specific time ranges.
### 2. Specify Target Location
Location Input: Users can specify locations by searching, entering latitude and longitude, or pinning a spot on the map.
Multiple Location Selection: Users can save which locations they would like to subscribe to or query.
Pixel Determination: We utilizes the WRS-2 system to identify the target pixel and display the Landsat scene extent on the map.
### 3. Receive Notifications for Upcoming Landsat Passes and Accessible Processed Data
Subscription Feature: Users can add favorite locations to receive notifications for upcoming satellite passes and when the latest Landsat data is available for them to view.
Notification Methods: We will mainly send users emails to remind them, but also provide a count down timer for when the Landsat 8 or 9 passes by their subscribed locations.
### 4. Mapping Relevant Landsat SR Data
Grid Display: Presents a 3x3 grid of Landsat pixels centered on the target location, along with metadata (satellite, date, time, location, path/row, cloud cover, and quality).
SR Parameters: By tapping each grid, our app shows remote sensing indices like NDVI and NDWI, as long as a graph on the pixel values of each band (B1 ~ B7 & B10).
### 5. Data Download
Download/Share Option: Users can easily download or share data in CSV formats.
### 6. Other Innovations
A report page for people to submit their problems with the measurements of landsat SR data.
A tutorial page to help users understand how to use our app.
### Benefits
User-Friendly: Simplifies access with visualized UI.
Security and customization: log in/out function enable user to have customized experience by collecting profile information and problem report system.
Timely Insights: Real-time notifications ensure users stay updated on satellite passes and data availability.
Comprehensive Analysis: The ability to visualize and download relevant data.
### Goals
We wish that our app can increase everyone's interesting in exploring landsat data by making the interactions of learning extremely simple and convenient. We also hope that our app can help users who may not have the ability to access big, bulky and raw landsat images to still appreciate and understand the knowledge landsat data can bring. 

### Development Tools
Coding Languages: Javascript, Typescript (front-end), Python (back-end), Firebase(database).
Frameworks: React, Next-js(front-end) FastAPI, Flask(back-end)
Software: Google Firebase, Google Cloud Platform, Google Earth Engine