import { LocationModel, TLocation } from "../models/location-model";
import { parsePersonDto, serializePersonModel } from "../dtos/person-dto";
import { MapDto, parseMapDto } from "@/dtos/map-dto";
import { MapModel } from "@/models/map-model";

export class MapApi {
  static create() {
    return new MapApi();
  }

  async fetchMapDatasets(
    startDate: string,
    endDate: string,
    locations: TLocation[]
  ): Promise<[error: Error | null, datasets: MapModel[] | null]> {
    try {
      const response = await fetch(
        `/api/map/dataset?startDate=${startDate}&endDate=${endDate}&locations=${locations}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);

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
}
