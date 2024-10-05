import { DatasetModel } from "@/models/dataset-model";
import { MapModel } from "@/models/map-model";

export type MapDto = {
  collection_name: string;
  dataset_id: {
    id: string;
    date: string;
    cloud_cover: number;
  }[];
};

export const parseMapDto = (dto: MapDto): MapModel => {
  return MapModel.create(
    dto.collection_name,
    dto.dataset_id.map((dataset) =>
      DatasetModel.create(dataset.id, dataset.date, dataset.cloud_cover)
    )
  );
};

export const serializeMapModel = (map: MapModel): MapDto => {
  return {
    collection_name: map.getCollectionName(),
    dataset_id: map.getDataset().map((dataset) => ({
      id: dataset.getId(),
      date: dataset.getDate(),
      cloud_cover: dataset.getCloudCoverage(),
    })),
  };
};
