import { DatasetModel } from "@/models/dataset-model";
import { MapModel } from "@/models/map-model";
import { TLocation } from "@/types";

export type MapDto = {
  collection_name: string;
  location: TLocation;
  dataset_id: {
    id: string;
    date: string;
    cloud_cover: number;
  }[];
};

export const parseMapDto = (dto: MapDto): MapModel => {
  return MapModel.create(
    dto.collection_name,
    dto.location,
    dto.dataset_id.map((dataset) =>
      DatasetModel.create(dataset.id, dataset.date, dataset.cloud_cover)
    )
  );
};

export const serializeMapModel = (map: MapModel): MapDto => {
  return {
    collection_name: map.getCollectionName(),
    location: map.getLocation(),
    dataset_id: map.getDataset().map((dataset) => ({
      id: dataset.getId(),
      date: dataset.getDate(),
      cloud_cover: dataset.getCloudCoverage(),
    })),
  };
};
