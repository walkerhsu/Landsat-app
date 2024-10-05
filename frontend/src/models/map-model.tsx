import { DatasetModel } from "./dataset-model";

export class MapModel {
  constructor(
    private collectionName: string,
    private dataset: DatasetModel[]
  ) {}

  static create(collection_name: string, dataset_id: DatasetModel[]): MapModel {
    return new MapModel(collection_name, dataset_id);
  }

  public getCollectionName(): string {
    return this.collectionName;
  }

  public getDataset(): DatasetModel[] {
    return this.dataset;
  }

  public addDataset(dataset: DatasetModel): void {
    this.dataset.push(dataset);
  }
}
