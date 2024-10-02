# Landsat App

Welcome to the Landsat App! This application allows users to explore and analyze satellite imagery from the Landsat program.

## Features

- **Browse Imagery**: View high-resolution satellite images.
- **Analyze Data**: Perform various analyses on the imagery data.
- **Download**: Save images and data for offline use.

## Pre-requisites

1. Clone the repository:
   ```sh
   git clone https://github.com/walkerhsu/Landsat-app.git
   ```
2. Navigate to the project directory:
   ```sh
   cd Landsat-app
   ```

## Backend Installation

1. cd backend
2. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
3. Download the WRS-2 shapefile from [here](https://www.usgs.gov/media/files/landsat-wrs-2-descending-path-row-shapefile?fbclid=IwY2xjawFp_pxleHRuA2FlbQIxMAABHTm0y6w-RoejS6mhpnXnaCbeG73kpmbYd8vL2syKw2BkSLEafDngEzuJJw_aem_KbyoOgpr-g6Un6s8RxyH4w) and place it in the `backend` directory.

## Landsat App Installation

1. Install dependencies:
   ```sh
   cd landsat-app
   yarn
   ```
2. Create a `.env.local` file in the root directory and add the following:
   ```sh
   NEXT_PUBLIC_MAPBOX_TOKEN=<your_mapbox_token>
   ```

## Usage

### Test the backend:

```sh
cd backend
python web_crawler.py
```

It will get the Landsats bands and get the cloud cover percentage for the coordinates of the Taipei City from 2024-09-01 to 2024-09-30.

### Start the application:

```sh
cd landsat-app
yarn run start
```

Open your browser and go to `http://localhost:3000` to use the app.
