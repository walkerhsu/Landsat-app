export type TLocation = { lat: number; lng: number }

export class LocationModel {
  constructor(
    private id: string,
    private place: string,
    private latlng: TLocation,
    private dataset: string,
    private addedDate: string
  ) {}

  static create(
    id: string,
    place: string,
    latlng: TLocation,
    dataset: string,
    addedDate: string
  ): LocationModel {
    return new LocationModel(id, place, latlng, dataset, addedDate);
  }

  public getId() {
    return this.id;
  }

  public getPlace() {
    return this.place;
  }

  public getLatlng() {
    return this.latlng;
  }

  public getDataset() {
    return this.dataset;
  }

  public getAddedDate() {
    return this.addedDate;
  }

  public updateDataset(newDataset: string) {
    this.dataset = newDataset;
  }

  public clone() {
    return new LocationModel(
      this.id,
      this.place,
      this.latlng,
      this.dataset,
      this.addedDate
    );
  }
}
