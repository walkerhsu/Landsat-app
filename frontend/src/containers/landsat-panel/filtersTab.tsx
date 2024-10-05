import React, { useState } from "react";
import { Datepicker } from "flowbite-react";
import styles from "./styles/tab.module.css";
import { LsText } from "@/components/LsText";
import { Slider } from "@/components/magicui/slider";
import { useDispatch } from "react-redux";
import {
  setDatasetAttributeOfCloudCoverage,
  setDatasetAttributeOfTimespan,
} from "@/app/redux/dataAttribute-slice";
import { formatDate } from "@/lib/utils";

const FiltersTab: React.FC = () => {
  const dispatch = useDispatch();
  const [cloudCoverage, setCloudCoverage] = useState([0, 100]); // Slider range for cloud coverage
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());

  const handleSetCloudCoverage = (value: number[]) => {
    setCloudCoverage(value);
    dispatch(
      setDatasetAttributeOfCloudCoverage({
        min: value[0],
        max: value[1],
      })
    );
  };

  const handleSetStartDate = (date: Date) => {
    setStartDate(date);
    console.log("Start Date:", date);
  };

  const handleSetEndDate = (date: Date) => {
    setEndDate(date);
    dispatch(
      setDatasetAttributeOfTimespan({
        startDate: formatDate(startDate),
        endDate: formatDate(date),
      })
    );
    console.log("End Date:", date);
  };

  return (
    <div className={styles.tabContent}>
      {/* Cloud Coverage Slider */}
      <div className={styles.controller}>
        <div
          style={{
            marginBottom: "10px",
          }}
        >
          <LsText>Cloud Coverage</LsText>
        </div>
        <Slider
          value={cloudCoverage}
          onValueChange={(value) => handleSetCloudCoverage(value)}
          max={100}
          step={1}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <LsText>{cloudCoverage[0]}%</LsText>
          <LsText>{cloudCoverage[1]}%</LsText>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className={styles.controller}>
        <LsText>Date Range</LsText>
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            gap: "1rem",
            width: "100%",
            padding: "10px",
          }}
        >
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ display: "flex", flexBasis: "30%" }}>
              <LsText>Start Date</LsText>
            </div>
            <Datepicker
              onChange={() => handleSetStartDate}
              placeholder="Select start date"
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ display: "flex", flexBasis: "30%" }}>
              <LsText>End Date</LsText>
            </div>
            <Datepicker
              onChange={() => handleSetEndDate}
              minDate={startDate ? startDate : new Date()}
              placeholder="Select End date"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersTab;
