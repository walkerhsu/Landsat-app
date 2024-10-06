import React, { useState } from "react";
// import D3BarChart from './D3BarChart'; // Import the D3 Bar Chart component
import styles from "./styles/footerPanel.module.css";
import { LsText } from "../LsText";
import { LsIcon } from "../LsIcon";
import { LsIconName } from "@/constants/ls-icon";
import { NumberTickerComponent } from "../number-ticker";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { SRDataDisplay } from "./bentoGrid";
// import { MarqueeSRData } from "./marquee";

// Example data for the bar chart
const barChartData = [
  { label: "A", value: 12 },
  { label: "B", value: 19 },
  { label: "C", value: 5 },
  { label: "D", value: 8 },
];

const FooterPanel: React.FC = () => {
  const srData = useSelector((state: RootState) => state.srData.data);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.footerPanel} ${isOpen ? "" : styles.collapsed}`}>
      <div className={styles.toggleButtonContainer}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={styles.toggleButton}
        >
          {isOpen ? (
            <LsIcon name={LsIconName.Down} />
          ) : (
            <LsIcon name={LsIconName.Up} />
          )}
        </button>
      </div>

      {isOpen && (
        <div className={styles.panelContent}>
          {/* Title */}
          <div style={{ marginBottom: "1rem" }}>
            <LsText>Statistics Panel</LsText>
          </div>

          {/* Statistics List */}
          {/* <MarqueeSRData sr_data={srData } /> */}
          <SRDataDisplay srData={srData!} />
          {/* <div style={{display: 'flex', margin: '1rem 0', gap: '1rem'}}>
            <LsText>NDVI:</LsText>
            <NumberTickerComponent value={0.45} />
            <LsText>NDSI:</LsText>
            <NumberTickerComponent value={0.65} />
            <LsText>Cloud Cover:</LsText>
            <NumberTickerComponent value={0.1} />
          </div> */}

          {/* D3 Bar Chart */}
          <div className={styles.graphContainer}>
            {/* <D3BarChart data={barChartData} width={600} height={300} /> */}
          </div>

          {/* More Statistics */}
          {/* <div className={styles.statistics}>
            <LsText>Statistic D: 90%</LsText>
            <LsText>Statistic E: 50%</LsText>
            <LsText>Statistic F: 15%</LsText>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default FooterPanel;
