import { PersonModel } from "../models/person-model";
import { parsePersonDto, serializePersonModel } from "../dtos/person-dto";

export class ProfileApi {
  static create() {
    return new ProfileApi();
  }

  async fetchUserProfile(
    userId: string
  ): Promise<[error: Error | null, userProfile: PersonModel | null]> {
    try {
      const response = await fetch(`/api/profile/read/${userId}`);

      if (!response.ok) {
        const { detail } = (await response.json()) as { detail: string };
        return [new Error(detail), null];
      } else {
        const userProfileDto = await response.json();
        return [null, parsePersonDto(userProfileDto)];
      }
    } catch (error: any) {
      return [new Error(error.message), null];
    }
  }
  async saveProfile(
    userData: PersonModel
  ): Promise<[error: Error | null, status: string | null]> {
    try {
      const response = await fetch("/api/profile/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        console.error("Failed to save profile");
        const { detail } = (await response.json()) as { detail: string };
        return [new Error(detail), null];
      }

      const { status, id } = (await response.json()) as {
        status: string;
        id: string;
      };
      console.log("in api", status, id);
      return [null, status];
    } catch (error: any) {
      return [new Error(error.message), null];
    }
  }

  async updateProfile(
    userData: PersonModel
  ): Promise<[error: Error | null, status: string | null]> {
    try {
      const response = await fetch("/api/profile/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serializePersonModel(userData)),
      });

      if (!response.ok) {
        const { detail } = (await response.json()) as { detail: string };
        return [new Error(detail), null];
      }

      const { status, id } = (await response.json()) as {
        status: string;
        id: string;
      };
      return [null, status];
    } catch (error: any) {
      return [new Error(error.message), null];
    }
  }
}
