import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useUser } from "@clerk/nextjs";

const CountdownTimer = () => {
  const [targetDate, setTargetDate] = useState(new Date().getTime() + 60000); // Initial target: 1 minute from now
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [landsatID, setLandsatID] = useState<string | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const { isSignedIn, user } = useUser();
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const person = useSelector((state: RootState) => state.person);

  function calculateTimeLeft() {
    const difference = targetDate - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  useEffect(() => {
    console.log(person);
    updateTargetDate();
  }, [person]);

  useEffect(() => {
    if (
      timeLeft.days === 0 &&
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      updateTargetDate();
    }
  }, [timeLeft]);

  const updateTargetDate = async () => {
    try {
      // Replace this with your actual API call
      if (!isSignedIn || !user) {
        return ;
      }
      const user_response = await fetch(`/api/profile/read/${user.id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const user_data = await user_response.json();
      console.log(user_data);

      if (!user_data.locationHistory || user_data.locationHistory.length === 0) {
        return ;
      }
      
      console.log(person.locationHistory);
      const response = await fetch("/api/closestLandsatTime", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user_data.locationHistory), // Add 1 minute
      });
      const data = await response.json();
      let date = new Date(data.next_time);
      const fixDate = (date) => {
        let dateLocal = new Date(date);
        let newDate = new Date(
          dateLocal.getTime() - dateLocal.getTimezoneOffset() * 60 * 1000
        );
        return newDate;
      };
      date = fixDate(date);
      setTargetDate(date.getTime());
      setLandsatID(data.landsat);
      setLocation(data.location.place);
      setError(null);
    } catch (err) {
      setError("Failed to update target date. Please try again.");
    }
  };

  if (person.locationHistory.length === 0 || !isSignedIn || !user) {
    return (
      <div
        className="text-xl font-mono mb-4 text-white flex-wrap"
        style={{ textAlign: "center" }}
      >
        Sign in and add location!
      </div>
    );
  }

  return (
    <>
      <div
        className="text-l font-mono text-white flex-wrap"
        style={{ textAlign: "center" }}
      >
        Landsat {landsatID} is going to pass over {location} in:
      </div>
      <div className="text-3xl font-mono text-red-400">
        {timeLeft.days}D-{timeLeft.hours}h-{timeLeft.minutes}m-
        {timeLeft.seconds}s
      </div>
    </>
  );
};

export default CountdownTimer;
