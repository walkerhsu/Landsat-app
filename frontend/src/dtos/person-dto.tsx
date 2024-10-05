import { TLocation } from "@/types";
import { LocationModel } from "@/models/location-model";
import { PersonModel } from "@/models/person-model";
import { ActivityModel } from "@/models/activity-model";


export type PersonDto = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  locationHistory: {
    place: string;
    latlng: TLocation;
    dataset: string;
    addedDate: string;
  }[];
  phone: string;
  address?: {
    street: string;
    cityState: string;
    postcode: string;
  };
  details: { label: string; field: string }[];
  //   activities?: ActivityModel[];
  //   compensationHistory?: CompensationInfo[];
};

export const parsePersonDto = (dto: PersonDto): PersonModel => {
  return PersonModel.create(
    dto.id,
    dto.name,
    dto.avatarUrl,
    dto.phone ?? "",
    dto.email,
    {
      street: dto.address?.street ?? "",
      cityState: dto.address?.cityState ?? "",
      postcode: dto.address?.postcode ?? "",
    },
    dto.details ?? [],
    dto.locationHistory.map((loc) =>
      LocationModel.create(
        `${loc.latlng.lat.toString()} + ${loc.latlng.lng.toString()}`,
        loc.place,
        loc.latlng,
        loc.dataset,
        loc.addedDate
      )
    )
    // activities: dto.activities ?? [],
    // compensationHistory: dto.compensationHistory ?? [],
  );
};

export const serializePersonModel = (person: PersonModel): PersonDto => {
  return {
    id: person.getId(),
    name: person.getName(),
    avatarUrl: person.getAvatarUrl(),
    email: person.getEmail(),
    locationHistory: person.getLocationHistory().map((location) => ({
        place: location.getPlace(),
        latlng: location.getLatlng(),
        dataset: location.getDataset(),
        addedDate: location.getAddedDate(),
    })),
    phone: person.getPhone(),
    address: {
      street: person.getAddress().street,
      cityState: person.getAddress().cityState,
      postcode: person.getAddress().postcode,
    },
    details: person
      .getDetails()
      .map((detail) => ({ label: detail.label, field: detail.field })),
  };
};
