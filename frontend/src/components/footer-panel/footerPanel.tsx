import React, { useEffect, useState } from "react";
// import D3BarChart from './D3BarChart'; // Import the D3 Bar Chart component
import styles from "./styles/footerPanel.module.css";
import { LsText } from "../LsText";
import { LsIcon } from "../LsIcon";
import { LsIconName } from "@/constants/ls-icon";
import { NumberTickerComponent } from "../number-ticker";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { SRDataDisplay } from "./bentoGrid";
import SpectrumChart from "@/components/footer-panel/graph";
import { SR_data } from "@/app/redux/srData-slice";
import DataDisplayPanels from "./resizable";
import { NoContentSection } from "../no-content-section";
// import { MarqueeSRData } from "./marquee";
import Draggable from "react-draggable";
import { DragCloseDrawer } from "./dragClosePanel";

// Example data for the bar chart
const barChartData = [
  { label: "A", value: 12 },
  { label: "B", value: 19 },
  { label: "C", value: 5 },
  { label: "D", value: 8 },
];

const mockSRData: SR_data = {
  color: "#FF5733", // Example color (Hex code)
  ndvi: 0.78, // NDVI value
  ndwi: 0.62, // NDWI value
  evi: 0.55, // EVI value
  savi: 0.72, // SAVI value
  ndmi: 0.45, // NDMI value
  nbr: 0.6, // NBR value
  nbr2: 0.4, // NBR2 value
  ndsi: 0.1, // NDSI value
  temperature: 298.15, // Temperature in Kelvin
  b1: 0.1,
  b2: 0.1,
  b3: 0.1,
  b4: 0.1,
  b5: 0.1,
  b6: 0.1,
  b7: 0.1,
  b8: 0.1,
};

const FooterPanel: React.FC = () => {
  const srData = useSelector((state: RootState) => state.srData.data);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (srData) {
      setIsOpen(true);
    }
  }, [srData]);

  return (
    <div
      className={`${styles.footerPanel} ${isOpen ? "" : styles.collapsed}`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* <DragCloseDrawer open={isOpen} setOpen={setIsOpen}> */}
      <div className={styles.panelContent}>
        {/* Title */}
        <div style={{ marginBottom: "1rem" }}>
          <LsText>Statistics Panel</LsText>
        </div>

        {/* Statistics List */}

        {srData ? (
          <DataDisplayPanels srData={srData} />
        ) : (
          <NoContentSection message="There is no SR Data Available" />
        )}
      </div>
      {/* </DragCloseDrawer> */}
    </div>

    //   <div
    //     className={`${styles.footerPanel} ${isOpen ? "" : styles.collapsed}`}
    //     onClick={() => setIsOpen(!isOpen)}
    //   >
    //     <div className={styles.toggleButtonContainer}>
    //       <button
    //         onClick={() => setIsOpen(!isOpen)}
    //         className={styles.toggleButton}
    //       >
    //         {isOpen ? (
    //           <LsIcon name={LsIconName.Down} />
    //         ) : (
    //           <LsIcon name={LsIconName.Up} />
    //         )}
    //       </button>
    //     </div>

    //     {isOpen && (
    //       <div className={styles.panelContent}>
    //         {/* Title */}
    //         <div style={{ marginBottom: "1rem" }}>
    //           <LsText>Statistics Panel</LsText>
    //         </div>

    //         {/* Statistics List */}

    //         {/* <MarqueeSRData sr_data={srData } /> */}
    //         {/* <SRDataDisplay srData={mockSRData }/> */}
    //         {/* <ResizableDemo srData={mockSRData}/> */}
    //         {srData ? (
    //           <DataDisplayPanels srData={srData} />
    //         ) : (
    //           <NoContentSection message="There is no SR Data Available" />
    //         )}
    //         {/* <div style={{display: 'flex', margin: '1rem 0', gap: '1rem'}}>
    //           <LsText>NDVI:</LsText>
    //           <NumberTickerComponent value={0.45} />
    //           <LsText>NDSI:</LsText>
    //           <NumberTickerComponent value={0.65} />
    //           <LsText>Cloud Cover:</LsText>
    //           <NumberTickerComponent value={0.1} />
    //         </div> */}

    //         {/* D3 Bar Chart */}
    //         <div className={styles.graphContainer}>
    //           {/* <D3BarChart data={barChartData} width={600} height={300} /> */}
    //         </div>

    //         <div
    //           style={
    //             {
    //               // borderColor: "#FFFFFF",
    //               // width: "275px",
    //               // // backgroundColor: "rgba(40, 40, 40, 0.85)",
    //               // borderRadius: "10px",
    //               // position: "absolute",
    //               // zIndex: "10",
    //               // padding: "10px",
    //             }
    //           }
    //         >
    //           {/* <SpectrumChart></SpectrumChart> */}
    //         </div>

    //         {/* More Statistics */}
    //         {/* <div className={styles.statistics}>
    //           <LsText>Statistic D: 90%</LsText>
    //           <LsText>Statistic E: 50%</LsText>
    //           <LsText>Statistic F: 15%</LsText>
    //         </div> */}
    //       </div>
    //     )}
    //   </div>
  );
};

export default FooterPanel;
