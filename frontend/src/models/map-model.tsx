import { TLocation } from "@/types";
import { DatasetModel } from "./dataset-model";

export class MapModel {
  constructor(
    private collectionName: string,
    private location: TLocation,
    private dataset: DatasetModel[]
  ) {}

  static create(
    collection_name: string,
    location: TLocation,
    dataset_id: DatasetModel[]
  ): MapModel {
    return new MapModel(collection_name, location, dataset_id);
  }

  public getCollectionName(): string {
    return this.collectionName;
  }

  public getLocation(): TLocation {
    return this.location;
  }

  public getDataset(): DatasetModel[] {
    return this.dataset;
  }

  public addDataset(dataset: DatasetModel): void {
    this.dataset.push(dataset);
  }
}
