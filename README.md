# Landsat App

Welcome to the Landsat App! This application allows users to explore and analyze satellite imagery from the Landsat program.

## Features

- **Browse Imagery**: View high-resolution satellite images.
- **Analyze Data**: Perform various analyses on the imagery data.
- **Download**: Save images and data for offline use.

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/walkerhsu/Landsat-app.git
    ```
2. Navigate to the project directory:
    ```sh
    cd Landsat-app
    ```
3. Install dependencies:
    ```sh
    yarn
    ```
4. Create a `.env.local` file in the root directory and add the following:
    ```sh
    NEXT_PUBLIC_MAPBOX_TOKEN=<your_mapbox_token>
    ```

## Usage

Start the application:
```sh
yarn run start
```
Open your browser and go to `http://localhost:3000` to use the app.