"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MoreVertical, MapPin, Mail, Phone } from "lucide-react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/magicui/tabs";
import { Card, CardContent } from "@/components/magicui/card";
import { Input } from "@/components/magicui/input";
import { Person } from "./info";
import { LsIconName } from "@/constants/ls-icon";
import { LsIcon } from "../LsIcon";
import { LsText } from "../LsText";
import { LsFontFamily, LsFontSize, LsFontWeight } from "@/constants/ls-fonts";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "notifications", label: "Notifications" },
];

type Props = {
  currentTab: string;
};

const PersonProfile: React.FC<Props> = ({ currentTab }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editablePerson, setEditablePerson] = useState<Person>(Person);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleDeleteLocation = React.useCallback(
    (locationToDelete: string) => {
      setEditablePerson((prevPerson) => ({
        ...prevPerson,
        locationHistory: prevPerson.locationHistory.filter(
          (location) => location.place !== locationToDelete
        ),
      }));
    },
    []
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditablePerson((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditablePerson((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleDetailsChange = (e) => {
    const { name, value } = e.target;

    setEditablePerson((prev) => ({
      ...prev,
      details: prev.details.map((detail) =>
        detail.label === name ? { ...detail, field: value } : detail
      ),
    }));
  };

  const handleTabChange = (value: string) => {
    router.push(`/profile/${value === "overview" ? "" : value}`);
  };
  return (
    <div className="w-full mx-auto p-6 bg-black text-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <button className="bg-black hover:bg-gray-700 text-white px-4 py-2 rounded-md flex gap-2">
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

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1">
              <Card className="bg-black border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <Image
                        src={editablePerson.avatarUrl}
                        alt={editablePerson.name}
                        className="w-16 h-16 rounded-lg mr-4"
                      />
                      <div>
                        {isEditing ? (
                          <Input
                            type="text"
                            name="name"
                            value={editablePerson.name}
                            onChange={handleInputChange}
                            className="p-3 text-xl font-semibold text-white bg-transparent border-b-2 border-white"
                          />
                        ) : (
                          <h2 className="text-xl font-semibold text-white">
                            {editablePerson.name}
                          </h2>
                        )}
                        <p className="text-gray-400">{editablePerson.id}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleEditClick}
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
                              value={editablePerson.phone}
                              onChange={handleInputChange}
                              className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                            />
                          ) : (
                            editablePerson.phone
                          )}
                        </p>
                        <p className="flex items-center text-gray-300">
                          <Mail className="w-4 h-4 mr-2" />
                          {isEditing ? (
                            <Input
                              type="email"
                              name="email"
                              value={editablePerson.email}
                              onChange={handleInputChange}
                              className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                            />
                          ) : (
                            editablePerson.email
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
                                value={editablePerson.address.street}
                                onChange={handleAddressChange}
                                className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                              />
                            ) : (
                              editablePerson.address.street
                            )}
                          </p>
                          <p className="ml-6 text-gray-300">
                            {isEditing ? (
                              <Input
                                type="text"
                                name="cityState"
                                value={editablePerson.address.cityState}
                                onChange={handleAddressChange}
                                className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                              />
                            ) : (
                              editablePerson.address.cityState
                            )}
                          </p>
                          <p className="ml-6 text-gray-300">
                            {isEditing ? (
                              <Input
                                type="text"
                                name="postcode"
                                value={editablePerson.address.postcode}
                                onChange={handleAddressChange}
                                className="bg-transparent border-b-2 border-gray-300 text-gray-300"
                              />
                            ) : (
                              editablePerson.address.postcode
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4">
                        <h3 className="font-semibold text-white mb-2">
                          Person details
                        </h3>
                        <div className="space-y-2 w-full">
                          {editablePerson.details.map((detail) => (
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
                              {isEditing ? (
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
                        {editablePerson.locationHistory.map((location, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-700 last:border-b-0"
                          >
                            <td className="px-6 py-4 text-gray-300">
                              {location.place}
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {location.latlng.lat.toString() +
                                ", " +
                                location.latlng.lng.toString()}
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {location.dataset}
                            </td>
                            <td className="px-6 py-4 text-gray-300">
                              {location.addedDate}
                            </td>
                            <td className="px-6 py-4">
                              <button
                                className="text-gray-400 hover:text-gray-300"
                                onClick={() =>
                                  handleDeleteLocation(location.place)
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

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    Activity
                  </h3>
                  <Card className="bg-black border-gray-700">
                    <CardContent className="p-6 space-y-4">
                      {Person.activities.map((activity, index) => (
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
                      {Person.compensationHistory.map((comp, index) => (
                        <div key={index}>
                          <p className="font-semibold text-white">
                            {comp.amount.toFixed(2)} USD per {comp.frequency}
                          </p>
                          <p className="text-gray-400">
                            Effective date on {comp.effectiveDate}
                          </p>
                        </div>
                      ))}
                      <button className="text-blue-400 hover:text-blue-300">
                        View all
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonProfile;
