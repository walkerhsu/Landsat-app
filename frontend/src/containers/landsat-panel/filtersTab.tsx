import React, { useState } from "react";
import { Datepicker } from "flowbite-react";
import styles from "./styles/tab.module.css";
import { LsText } from "@/components/LsText";
import { Slider } from "@/components/magicui/slider";
import { useDispatch, useSelector } from "react-redux";
import {
  setDatasetAttributeOfCloudCoverage,
  setDatasetAttributeOfTimespan,
} from "@/app/redux/dataAttribute-slice";
import { formatDate } from "@/lib/utils";
import { RootState } from "@/app/redux/store";

type FilterProps = {
  isEditMode: boolean;
};

const FiltersTab: React.FC<FilterProps> = ({ isEditMode }) => {
  const savedStartDate = useSelector(
    (state: RootState) => state.dataAttribute.timespan.startDate
  );
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

  const handleSetStartDate = (e) => {
    console.log(e);
    setStartDate(e);
    dispatch(
      setDatasetAttributeOfTimespan({
        startDate: formatDate(e),
        endDate: formatDate(e),
      })
    );
    console.log("Start Date:", e);
  };

  const handleSetEndDate = (e) => {
    // const { date } = e.target.value;
    setEndDate(e);
    dispatch(
      setDatasetAttributeOfTimespan({
        startDate: savedStartDate,
        endDate: formatDate(e),
      })
    );
    console.log("End Date:", e);
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
              onChange={handleSetStartDate}
              placeholder="Select start date"
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div style={{ display: "flex", flexBasis: "30%" }}>
              <LsText>End Date</LsText>
            </div>
            <Datepicker
              onChange={handleSetEndDate}
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
