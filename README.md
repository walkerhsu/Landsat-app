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
3. Make sure you have the Google Earth Engine API key in the `backend` directory.
It should be a json file with the service account email and private key.

## Landsat App Installation

1. Install dependencies:
   ```sh
   cd frontend
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
python get_google_band_data.py
```

It will get the RGB values for the coordinates and its neighboring 3x3 coordinates of the Taipei City from 2024-09-01 to 2024-09-30.

### Start the application:

```sh
cd landsat-app
yarn run start
```

Open your browser and go to `http://localhost:3000` to use the app.
