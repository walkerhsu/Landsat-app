import { deduplicateArray } from "../lib/utils";
import { LocationModel } from "./location-model";
import { ActivityModel } from "./activity-model";
import { CompensationModel } from "./compensation-model";

type Detail = {
  label: string;
  field: string;
};

type Address = {
  street: string;
  cityState: string;
  postcode: string;
};

export class PersonModel {
  constructor(
    private id: string,
    private name: string,
    private avatarUrl: string,
    private phone: string,
    private email: string,
    private address: Address,
    private details: Detail[],
    private locationHistory: LocationModel[] // private activities: ActivityModel[], // private compensationHistory: CompensationModel[]
  ) {}

  static create(
    id: string,
    name: string,
    avatarUrl: string,
    phone: string,
    email: string,
    address: Address,
    details: Detail[],
    locationHistory: LocationModel[]
    // activities: ActivityModel[],
    // compensationHistory: CompensationModel[]
  ): PersonModel {
    return new PersonModel(
      id,
      name,
      avatarUrl,
      phone,
      email,
      address,
      details,
      locationHistory
      //   activities,
      //   compensationHistory
    );
  }

  static createMockPerson = (): PersonModel => {
    console.log("Creating mock person");
    const location1 = new LocationModel(
        "1",
        "Taipei",
        { lat: 25.123456, lng: 121.654321 },
        "LANDSAT/LC08/C02/T1_TOA",
        "2024-09-01"
    )
    return PersonModel.create(
      "#MOCK12345", // Mock id
      "John Doe", // Mock name
      "/_next/static/media/profile_mock.jpeg", // Mock avatar URL
      "(123) 456-7890", // Mock phone
      "johndoe@example.com", // Mock email
      {
        street: "123 Main St", // Mock address
        cityState: "Springfield, IL",
        postcode: "62701",
      },
      [
        { label: "Occupation", field: "Engineer" }, // Mock details
        { label: "Hobby", field: "Photography" },
      ],
      [
        location1,
      ]
      // Uncomment below if you need mock activities or compensation history
      // mockActivities(),
      // mockCompensationHistory()
    );
  };

  public getDefaultImageUrl(): string {
    return "https://imgv3.fotor.com/images/blog-cover-image/10-profile-picture-ideas-to-make-you-stand-out.jpg";
  }

  public getId() {
    return this.id;
  }

  public getName() {
    return this.name;
  }

  public getAvatarUrl() {
    return this.avatarUrl;
  }

  public getPhone() {
    return this.phone;
  }

  public getEmail() {
    return this.email;
  }

  public getAddress() {
    return this.address;
  }

  public getDetails() {
    return this.details;
  }

  public getLocationHistory() {
    // console.log(this.locationHistory);
    return this.locationHistory;
  }

  public updateName(name: string) {
    this.name = name;
  }

  public updateAvatarUrl(avatarUrl: string) {
    this.avatarUrl = avatarUrl;
  }

  public updatePhone(phone: string) {
    this.phone = phone;
  }
  public updateEmail(email: string) {
    this.email = email;
  }

  public updateAddress(address: Address) {
    this.address = address;
  }

  public updateDetails(details: { label: string; field: string }) {
    const updatededDetail = this.details.map((detail) =>
      detail.label === details.label
        ? { ...detail, field: details.field }
        : detail
    );
    this.details = updatededDetail;
  }

  public pushLocationHistory(location: LocationModel) {
    this.locationHistory.push(location);
  }

  public removeLocationHistory(locationId: string) {
    this.locationHistory = this.locationHistory.filter(
      (location) => location.getId() !== locationId
    );
  }

  public updateLocationHistory(location: LocationModel) {
    const index = this.locationHistory.findIndex(
      (loc) => loc.getId() === location.getId()
    );
    this.locationHistory[index] = location;
  }

  public setLocationHistory(location: LocationModel[]) {
    this.locationHistory = location;
  }

  //   public getActivities() {
  //     return this.activities;
  //   }

  //   public getCompensationHistory() {
  //     return this.compensationHistory;
  //   }

  public addLocationHistory(newLocations: LocationModel[]) {
    const updatedLocationHistory = deduplicateArray(
      this.locationHistory.concat(newLocations),
      (location: LocationModel) => location.getId()
    );
    this.locationHistory = updatedLocationHistory;
  }

  //   public removeLocationHistory(locationIds: string[]) {
  //     const updatedLocationHistory = this.locationHistory.filter(
  //       (location) => !locationIds.includes(location.getId())
  //     );
  //     this.locationHistory = updatedLocationHistory;
  //   }

  public clone() {
    return new PersonModel(
      this.id,
      this.name,
      this.avatarUrl,
      this.phone,
      this.email,
      this.address,
      this.details,
      this.locationHistory
      //   this.activities,
      //   this.compensationHistory
    );
  }
}
