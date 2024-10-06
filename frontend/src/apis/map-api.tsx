import { TLocation } from "../models/location-model";
import { MapDto, parseMapDto } from "@/dtos/map-dto";
import { MapModel } from "@/models/map-model";
import { GeoJson } from "@/app/redux/selectedDataset-slice";
import { CloudCoverage } from "@/app/redux/dataAttribute-slice";

export interface DatasetLocation {
  datasetID: string;
  location: TLocation;
}

export class MapApi {
  static create() {
    return new MapApi();
  }

  async fetchMapDatasets(
    startDate: string,
    endDate: string,
    locations: TLocation[],
    cloudCoverage: CloudCoverage
  ): Promise<[error: Error | null, datasets: MapModel[] | null]> {
    try {
      const data = {
        startDate: startDate,
        endDate: endDate,
        locations: locations,
        cloudCoverage: cloudCoverage,
      };
      const response = await fetch("/api/map/dataset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      // console.log(response);

      if (!response.ok) {
        const { detail } = (await response.json()) as { detail: string };
        return [new Error(detail), null];
      } else {
        const mapDatasets = await response.json();
        return [null, mapDatasets.map((dto: MapDto) => parseMapDto(dto))];
      }
    } catch (error: any) {
      return [new Error(error.message), null];
    }
  }

  async fetchGeoJson(
    datasetID: string,
    location: TLocation
  ): Promise<[error: Error | null, geoJson: GeoJson | null]> {
    const data = { datasetID: datasetID, location: location };
    try {
      const response = await fetch("/api/map/geojson", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);

      if (!response.ok) {
        const { detail } = (await response.json()) as { detail: string };
        return [new Error(detail), null];
      } else {
        const geoJsons = await response.json();
        return [null, geoJsons];
      }
    } catch (error: any) {
      return [new Error(error.message), null];
    }
  }

  async downloadDataset(
    datesetLocation: DatasetLocation
  ): Promise<Error | null> {
    const data = { download_data: datesetLocation };
    try {
      const response = await fetch("/api/map/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const { file, filename } = await response.json();

      if (file && filename) {
        console.log("Downloading file: " + filename);

        // Assuming the file is a base64 encoded string
        const byteCharacters = atob(file);
        console.log(byteCharacters);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/octet-stream",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();

        // Clean up the URL object
        window.URL.revokeObjectURL(url);

        console.log("Successfully downloaded file");
        return null;
      } else {
        throw new Error("File data or filename is missing in the response");
      }
    } catch (error: any) {
      return new Error(error.message);
    }
  }

  async getReverseGeocode(
    latitude: number,
    longitude: number,
    accessToken: string
  ): Promise<any> {
    const url = `/api/map/geocoding?latitude=${latitude}&longitude=${longitude}&access_token=${accessToken}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data; // Return the JSON data
    } catch (error) {
      console.error("Error fetching reverse geocode:", error);
      throw error; // Rethrow or handle the error as needed
    }
  }
}
