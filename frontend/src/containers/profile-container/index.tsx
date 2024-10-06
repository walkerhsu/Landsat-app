"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { parsePersonModel, setEditablePerson } from "@/app/redux/person-slice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Mail, Phone } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/magicui/tabs";
import { Card, CardContent } from "@/components/magicui/card";
import { Input } from "@/components/magicui/input";
import { LsIconName } from "@/constants/ls-icon";
import { LsIcon } from "../../components/LsIcon";
import { LsText } from "../../components/LsText";
import { LsFontFamily, LsFontSize, LsFontWeight } from "@/constants/ls-fonts";
import { useUser, useClerk } from "@clerk/nextjs";
import { useSignIn } from "@clerk/clerk-react";
import { ProfileApi } from "@/apis/profile-api";
import { PersonModel } from "@/models/person-model";
// import { mockPerson } from "@/app/redux/info";
import { LocationModel } from "@/models/location-model";
import ReportPage from "@/containers/profile-container/report";
import { formatDate } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "report", label: "Report" },
];

type Props = {
  currentTab: string;
};

const PersonProfile: React.FC<Props> = ({ currentTab }) => {
  const profileApi = useMemo(() => ProfileApi.create(), []);
  const { isLoaded, signIn } = useSignIn();
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState<PersonModel | null>(null);
  const [draftUserProfile, setDraftUserProfile] = useState<PersonModel | null>(
    null
  );

  const handlefetchUserProfile = useCallback(
    async (userId: string) => {
      const [error, returnedUserProfile] = await profileApi.fetchUserProfile(
        userId
      );
      console.log(error, returnedUserProfile);
      if (error) {
        // notify users
        return error;
      }
      setUserProfile(returnedUserProfile);
      return null;
    },
    [profileApi, setUserProfile]
  );

  const resetDraftUserProfile = useCallback(() => {
    setDraftUserProfile(userProfile ? userProfile.clone() : null);
  }, [userProfile]);

  useEffect(() => {
    resetDraftUserProfile();
  }, [resetDraftUserProfile]);

  useEffect(() => {
    console.log(signIn, user?.id);
    if (isLoaded && signIn && user?.id) {
      console.log(user?.id);
      handlefetchUserProfile(user.id);
    }
    // } else if (isLoaded) {
    //   setUserProfile(mockPerson);
    // }
    if (userProfile) {
      dispatch(setEditablePerson(parsePersonModel(userProfile)));
    }
  }, [handlefetchUserProfile, signIn, user]);

  const handleUpdateProfile = useCallback(async () => {
    if (!draftUserProfile) {
      return;
    }
    let [error, status] = await profileApi.updateProfile(draftUserProfile);
    if (error) {
      console.error("Failed to update profile");
      return;
    }
    // error = await handlefetchUserProfile(draftUserProfile.getId());
    // if (error) {
    //   console.error("Failed to save profile");
    //   return;
    // }
    setIsEditing(!isEditing);
    if (userProfile) {
      dispatch(setEditablePerson(parsePersonModel(draftUserProfile)));
    }
    console.log("Profile successfully saved");
  }, [draftUserProfile, profileApi, handlefetchUserProfile]);

  const handleDeleteLocation = useCallback(
    async (locationToDelete: LocationModel) => {
      console.log(
        "Delete location's locationId: ",
        locationToDelete.getId(),
        draftUserProfile
      );
      if (!draftUserProfile) {
        return;
      }
      draftUserProfile.removeLocationHistory(locationToDelete.getId());
      let [error, status] = await profileApi.updateProfile(draftUserProfile);
      if (error) {
        console.error("Failed to update profile");
        return;
      }
      if (userProfile) {
        dispatch(setEditablePerson(parsePersonModel(draftUserProfile)));
      }
      console.log("Profile successfully deleted");
      error = await handlefetchUserProfile(draftUserProfile.getId());
      if (error) {
        console.error("Failed to save profile");
        return;
      }
    },
    [draftUserProfile, profileApi, handlefetchUserProfile]
  );

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setDraftUserProfile((prev) => {
        if (!prev) return null;
        const updatedProfile = prev.clone();
        updatedProfile.updateName(value);
        return updatedProfile;
      });
      // dispatch(updatePersonField({ field: "name", value: value }));
    },
    []
  );

  const handleLocationChanged = React.useCallback((location: LocationModel) => {
    setDraftUserProfile((prev) => {
      if (!prev) return null;
      const updatedProfile = prev.clone();
      updatedProfile.updateLocationHistory(location);
      return updatedProfile;
    });
  }, []);

  const handlePhoneChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setDraftUserProfile((prev) => {
        if (!prev) return null;
        const updatedProfile = prev.clone();
        updatedProfile.updatePhone(value);
        return updatedProfile;
      });
      // dispatch(updatePersonField({ field: "phone", value: value }));
    },
    []
  );

  const handleEmailChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setDraftUserProfile((prev) => {
        if (!prev) return null;
        const updatedProfile = prev.clone();
        updatedProfile.updateEmail(value);
        return updatedProfile;
      });
      // dispatch(updatePersonField({ field: "email", value: value }));
    },
    []
  );

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setDraftUserProfile((prev) => {
      if (!prev) return null;
      const updatedProfile = prev.clone();
      updatedProfile.updateAddress({
        ...updatedProfile.getAddress(),
        [name]: value,
      });
      return updatedProfile;
    });
    // dispatch(updateAddressField({ name: name, value: value }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    setDraftUserProfile((prev) => {
      if (!prev) return null;
      const updatedProfile = prev.clone();
      updatedProfile.updateDetails({ label: name, field: value });
      return updatedProfile;
    });
    // dispatch(updateDetailField({ name: name, value
  };

  const handleTabChange = (value: string) => {
    router.push(`/profile/${value === "overview" ? "" : value}`);
  };
  return (
    <div className="w-full mx-auto p-6 bg-black text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <button
          className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-md flex gap-2"
          onClick={() => signOut({ redirectUrl: "/" })}
        >
          <LsIcon name={LsIconName.Logout} />
          <LsText>Logout</LsText>
        </button>
      </div>

      <Tabs
        value={currentTab}
        onValueChange={handleTabChange}
        className="text-gray-100"
      >
        <TabsList className="bg-black border-gray-700 gap-3">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="text-white font-semibold hover:bg-gray-800"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {draftUserProfile && (
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <Card className="bg-black border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <Image
                          src={
                            draftUserProfile.getAvatarUrl() ||
                            draftUserProfile.getDefaultImageUrl()
                          }
                          alt={draftUserProfile.getName()}
                          className="w-16 h-16 rounded-lg mr-4"
                          width={64}
                          height={64}
                        />
                        <div className="mx-4">
                          {isEditing ? (
                            <Input
                              type="text"
                              name="name"
                              value={draftUserProfile.getName()}
                              onChange={handleNameChange}
                              className="w-40 p-3 text-xl font-semibold text-white bg-transparent border-b-2 border-white"
                            />
                          ) : (
                            <h2 className="text-xl font-semibold text-white">
                              {draftUserProfile.getName()}
                            </h2>
                          )}
                          <p className="text-gray-400 text-sm overflow-auto	">
                            {draftUserProfile.getId()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={
                          isEditing
                            ? handleUpdateProfile
                            : () => setIsEditing(!isEditing)
                        }
                        className="text-gray-400 hover:text-gray-300"
                      >
                        {isEditing ? (
                          <LsIcon name={LsIconName.Save} size="20px" />
                        ) : (
                          <LsIcon name={LsIconName.Edit} size="20px" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-4 w-full">
                        <h3 className="font-semibold text-white">About</h3>
                        <div className="space-y-2">
                          <p className="flex items-center text-gray-300">
                            <Phone className="w-4 h-4 mr-2" />
                            {isEditing ? (
                              <Input
                                type="text"
                                name="phone"
                                value={draftUserProfile.getPhone()}
                                onChange={handlePhoneChange}
                                className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                              />
                            ) : (
                              draftUserProfile.getPhone()
                            )}
                          </p>
                          <p className="flex items-center text-gray-300">
                            <Mail className="w-4 h-4 mr-2" />
                            {isEditing ? (
                              <Input
                                type="email"
                                name="email"
                                value={draftUserProfile.getEmail()}
                                onChange={handleEmailChange}
                                className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                              />
                            ) : (
                              draftUserProfile.getEmail()
                            )}
                          </p>
                        </div>

                        <div className="pt-4">
                          <h3 className="font-semibold text-white mb-2">
                            Address
                          </h3>
                          <div className="space-y-2">
                            <p className="flex items-center text-gray-300">
                              <MapPin className="w-4 h-4 mr-2" />
                              {isEditing ? (
                                <Input
                                  type="text"
                                  name="street"
                                  value={draftUserProfile.getAddress().street}
                                  onChange={handleAddressChange}
                                  className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                                />
                              ) : (
                                draftUserProfile.getAddress().street
                              )}
                            </p>
                            <p className="ml-6 text-gray-300">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  name="cityState"
                                  value={
                                    draftUserProfile.getAddress().cityState
                                  }
                                  onChange={handleAddressChange}
                                  className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                                />
                              ) : (
                                draftUserProfile.getAddress().cityState
                              )}
                            </p>
                            <p className="ml-6 text-gray-300">
                              {isEditing ? (
                                <Input
                                  type="text"
                                  name="postcode"
                                  value={draftUserProfile.getAddress().postcode}
                                  onChange={handleAddressChange}
                                  className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                                />
                              ) : (
                                draftUserProfile.getAddress().postcode
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="pt-4">
                          <h3 className="font-semibold text-white mb-2">
                            Person details
                          </h3>
                          <div className="space-y-2 w-full">
                            {draftUserProfile.getDetails().map((detail) => (
                              <div
                                className="flex justify-between text-gray-300"
                                key={detail.label}
                              >
                                <div className="basis-1/2">
                                  <LsText
                                    family={LsFontFamily.GeistSans}
                                    size={LsFontSize.Base}
                                    weight={LsFontWeight.Light}
                                  >
                                    {detail.label}
                                  </LsText>
                                </div>
                                {isEditing && detail.label != "Join Date" ? (
                                  <Input
                                    type="text"
                                    name={detail.label}
                                    value={detail.field || ""}
                                    onChange={handleDetailsChange}
                                    className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                                  />
                                ) : (
                                  <LsText
                                    family={LsFontFamily.GeistSans}
                                    size={LsFontSize.Base}
                                    weight={LsFontWeight.Light}
                                  >
                                    {detail.field}
                                  </LsText>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="col-span-2">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">
                      Favorite Locations
                    </h3>
                    <button className="text-blue-400 hover:text-blue-300">
                      + Add Info
                    </button>
                  </div>
                  <Card className="bg-black border-gray-700">
                    <CardContent className="p-0">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-gray-400 border-b border-gray-700">
                            <th className="px-6 py-3">PLACE</th>
                            <th className="px-6 py-3">LATLNG</th>
                            <th className="px-6 py-3">DATASET</th>
                            <th className="px-6 py-3">ADDED DATE</th>
                            <th className="px-6 py-3"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {draftUserProfile
                            .getLocationHistory()
                            .map((location, index) => (
                              <tr
                                key={index}
                                className="border-b border-gray-700 last:border-b-0"
                              >
                                <td className="px-6 py-4 text-gray-300">
                                  {location.getPlace()}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {location.getLatlng().lat.toString() +
                                    ", " +
                                    location.getLatlng().lng.toString()}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {location.getDataset()}
                                </td>
                                <td className="px-6 py-4 text-gray-300">
                                  {location.getAddedDate()}
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                    className="text-gray-400 hover:text-gray-300"
                                    onClick={() =>
                                      handleDeleteLocation(location)
                                    }
                                  >
                                    <LsIcon name={LsIconName.Delete} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </CardContent>
                  </Card>
                </div>

                {/* <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      Activity
                    </h3>
                    <Card className="bg-black border-gray-700">
                      <CardContent className="p-6 space-y-4">
                        {draftUserProfile.get.activities.map((activity, index) => (
                          <div key={index} className="flex items-center">
                            <Image
                              src={activity.avatarUrl}
                              alt={activity.name}
                              className="w-10 h-10 rounded-full mr-4"
                            />
                            <div>
                              <p className="font-semibold text-white">
                                {activity.name}
                              </p>
                              <p className="text-gray-400">
                                {activity.action} {activity.date}
                              </p>
                              <p className="text-gray-400">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                        <button className="text-blue-400 hover:text-blue-300">
                          View all
                        </button>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-white">
                      Compensation
                    </h3>
                    <Card className="bg-black border-gray-700">
                      <CardContent className="p-6 space-y-4">
                        {currentPerson.compensationHistory.map(
                          (comp, index) => (
                            <div key={index}>
                              <p className="font-semibold text-white">
                                {comp.amount.toFixed(2)} USD per{" "}
                                {comp.frequency}
                              </p>
                              <p className="text-gray-400">
                                Effective date on {comp.effectiveDate}
                              </p>
                            </div>
                          )
                        )}
                        <button className="text-blue-400 hover:text-blue-300">
                          View all
                        </button>
                      </CardContent>
                    </Card>
                  </div>
                </div>*/}
              </div>
            </div>
          </TabsContent>
          
          
        )}

        {draftUserProfile && (
          <TabsContent value="report">
          <ReportPage />
        </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default PersonProfile;