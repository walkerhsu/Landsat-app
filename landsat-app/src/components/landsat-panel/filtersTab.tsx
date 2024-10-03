import React, { useState } from 'react';
// import ReactSlider from 'react-slider';
import { Datepicker } from "flowbite-react";
import styles from './styles/tab.module.css';
import { LsText } from '../LsText';

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
        <LsText>Cloud Coverage</LsText>
        {/* <ReactSlider
          className={styles.slider}
          value={cloudCoverage}
          onChange={setCloudCoverage}
          min={0}
          max={100}
          step={1}
          thumbClassName={styles.thumb}
          trackClassName={styles.track}
          minDistance={5}
          renderThumb={(props, state) => <div {...props}>{state.valueNow}%</div>}
        /> */}
        <div className={styles.rangeLabels}>
          <span>{cloudCoverage[0]}%</span>
          <span>{cloudCoverage[1]}%</span>
        </div>
      </div>

      {/* Date Range Picker */}
      <div className={styles.controller}>
        <LsText>Date Range</LsText>
        <div style={{ display: 'flex', flexFlow: 'column', gap: '1rem', width: '100%', padding: '10px' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexBasis: '30%' }}>
              <LsText>Start Date</LsText>
            </div>
            <Datepicker
              onChange={setStartDate}
              placeholder="Select start date"
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ display: 'flex', flexBasis: '30%' }}>
              <LsText>End Date</LsText>
            </div>
            <Datepicker
              onChange={setEndDate}
              minDate={startDate ? startDate : new Date()}
              placeholder="Select End date"
            /></div>
        </div>
      </div>
    </div>
  );
};

export default FiltersTab;
