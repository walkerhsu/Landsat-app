"use client";

import React, { useState } from "react";

const NotificationSettingsPage = () => {
  const [leadTime, setLeadTime] = useState("");
  const [notificationMethod, setNotificationMethod] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle the submission logic here
    console.log({ leadTime, notificationMethod, location });
    // You can add API calls or other logic here
  };

  return (
    <div>
      <h1>Notification Settings</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Notification Lead Time:
          <input
            type="number"
            value={leadTime}
            onChange={(e) => setLeadTime(e.target.value)}
            placeholder="Hours or Days"
            required
          />
        </label>

        <label>
          Notification Method:
          <select
            value={notificationMethod}
            onChange={(e) => setNotificationMethod(e.target.value)}
            required
          >
            <option value="">Select Method</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </label>

        <label>
          Location (Latitude, Longitude):
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g., 40.7128, -74.0060"
            required
          />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default NotificationSettingsPage;
