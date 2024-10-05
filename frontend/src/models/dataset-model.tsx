export class DatasetModel {
  constructor(
    private id: string,
    private date: string,
    private cloudCoverage: number
  ) {}

  static create(id: string, date: string, cloudCoverage: number): DatasetModel {
    return new DatasetModel(id, date, cloudCoverage);
  }

  public getId(): string {
    return this.id;
  }

  public getDate(): string {
    return this.date;
  }

  public getCloudCoverage(): number {
    return this.cloudCoverage;
  }

  public updateCloudCover(newCloudCover: number): void {
    this.cloudCoverage = newCloudCover;
  }
}
