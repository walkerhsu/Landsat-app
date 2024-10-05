import { StaticImageData } from "next/image";

export class ActivityModel {
  constructor(
    private name: string,
    private avatarUrl: string | StaticImageData,
    private action: string,
    private date: string,
    private time: string
  ) {}

  static create(
    name: string,
    avatarUrl: string | StaticImageData,
    action: string,
    date: string,
    time: string
  ): ActivityModel {
    return new ActivityModel(name, avatarUrl, action, date, time);
  }

  public getName() {
    return this.name;
  }

  public getAvatarUrl() {
    return this.avatarUrl;
  }

  public getAction() {
    return this.action;
  }

  public getDate() {
    return this.date;
  }

  public getTime() {
    return this.time;
  }

  public clone() {
    return new ActivityModel(
      this.name,
      this.avatarUrl,
      this.action,
      this.date,
      this.time
    );
  }
}
