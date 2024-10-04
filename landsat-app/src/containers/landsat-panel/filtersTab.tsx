import React, { useState } from "react";
import { Datepicker } from "flowbite-react";
import styles from "./styles/tab.module.css";
import { LsText } from "@/components/LsText";
import { Slider } from "@/components/magicui/slider";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const FiltersTab: React.FC = () => {
  const [cloudCoverage, setCloudCoverage] = useState([0, 100]); // Slider range for cloud coverage
  const [value, onChange] = useState<Value>(new Date());
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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
          onValueChange={(value) => setCloudCoverage(value)}
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
              onChange={setStartDate}
              placeholder="Select start date"
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ display: "flex", flexBasis: "30%" }}>
              <LsText>End Date</LsText>
            </div>
            <Datepicker
              onChange={setEndDate}
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
