import React, { useCallback, useMemo, useState } from "react";
import styles from "./styles/panel.module.css";
import DataTab from "./dataTab";
import LocationsTab from "./locationsTab";
import FiltersTab from "./filtersTab";
import { LsText } from "@/components/LsText";
import { LsColor } from "@/constants/ls-color";
import { LsIconName } from "@/constants/ls-icon";
import { LsIcon } from "@/components/LsIcon";
import { LsFontSize } from "@/constants/ls-fonts";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { MapApi } from "@/apis/map-api";
import { MapModel } from "@/models/map-model";

const TABS = ["Filters", "Locations", "Data"];

const Panel: React.FC = () => {
  const dataAttributes = useSelector((state: RootState) => state.dataAttribute);
  const mapApi = useMemo(() => MapApi.create(), []);
  const [activeTab, setActiveTab] = useState("Filters");
  const [mode, setMode] = useState<"edit" | "read">("edit");
  const [queryDataset, setQueryDataset] = useState<MapModel[]>([]);
  const [loading, setLoading] = useState(false);

  const handleTabClick = (tab: string) => {
    if (mode === "edit") {
      setActiveTab(tab);
    }
  };

  const toggleMode = (newMode: "edit" | "read") => {
    setMode(newMode);
  };

  const handleQueryDataset = useCallback(async () => {
    console.log("Querying dataset...");
    setLoading(true);
    const [error, returnedMapDataset] = await mapApi.fetchMapDatasets(
      dataAttributes.timespan.startDate,
      dataAttributes.timespan.endDate,
      dataAttributes.locations,
      dataAttributes.cloudCoverage
    );

    setLoading(false);

    if (error) {
      console.error("Error fetching dataset:", error);
      return error;
    }

    if (!returnedMapDataset) {
      console.log("Dataset not found");
      return null;
    }

    setQueryDataset(returnedMapDataset);
    toggleMode("read");
  }, [mapApi, dataAttributes, setQueryDataset, toggleMode]);

  const handleDownloadDataset = () => {
    console.log("Downloading dataset...");
  };

  const renderEditMode = () => (
    <>
      <div className={styles.tabs}>
        {TABS.slice(0, 2).map((tab) => (
          <button
            key={tab}
            className={`${styles.tabButton} ${
              activeTab === tab ? styles.active : ""
            }`}
            onClick={() => handleTabClick(tab)}
          >
            <LsText color={activeTab === tab ? LsColor.White : LsColor.Grey400}>
              {tab}
            </LsText>
          </button>
        ))}
      </div>
      {activeTab === TABS[0] && <FiltersTab isEditMode={true} />}
      {activeTab === TABS[1] && <LocationsTab isEditMode={true} />}
      {/* {activeTab === TABS[2] && (
        <DataTab isEditMode={true} queryDataset={queryDataset} />
      )} */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        {loading ? (
          <LsIcon name={LsIconName.Processing} />
        ) : (
          <button className={styles.queryButton} onClick={handleQueryDataset}>
            <LsIcon
              name={LsIconName.Search}
              color={LsColor.White}
              size={"24px"}
            />
            <LsText>Query Dataset</LsText>
          </button>
        )}
      </div>
    </>
  );

  const renderReadMode = () => (
    <>
      {/* <div style={{ display: "flex", width: "30rem" }}></div> */}
      <div
        style={{
          display: "grid",
          width: "45vw",
          height: '50vh',
          padding: `${8}px`,
          gridTemplateColumns: `repeat(${2}, 1fr)`,
          flexFlow: "column wrap",
          gap: `${24}px`,
          overflow: 'auto',
          overflowWrap: "break-word",
        }}
      >
        {/* <div style={{ display: "flex", flexDirection: "column" }}> */}
        {/* <FiltersTab isEditMode={false} /> */}
        <LocationsTab isEditMode={false} />
        {/* </div> */}
        <DataTab isEditMode={false} queryDataset={queryDataset} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "10px",
        }}
      >
        <button
          className={styles.downloadButton}
          onClick={handleDownloadDataset}
        >
          <LsIcon
            name={LsIconName.ArrowBottom}
            color={LsColor.White}
            size={"24px"}
          />
          <LsText size={LsFontSize.Sm}>Download via Earthdata Search</LsText>
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: "flex" }}>
      <div className={styles.panel}>
        {mode === "edit" ? renderEditMode() : renderReadMode()}
      </div>
      <div className={styles.bookmarks}>
        <button
          className={`${styles.bookmark} ${
            mode === "edit" ? styles.activeMode : ""
          }`}
          onClick={() => toggleMode("edit")}
        >
          <LsIcon
            name={LsIconName.Edit}
            color={mode === "edit" ? LsColor.White : LsColor.Grey700}
            size={"24px"}
          />
        </button>
        <button
          className={`${styles.bookmark} ${
            mode === "read" ? styles.activeMode : ""
          }`}
          onClick={() => toggleMode("read")}
        >
          <LsIcon
            name={LsIconName.View}
            color={mode === "read" ? LsColor.White : LsColor.Grey700}
            size={"24px"}
          />
        </button>
      </div>
    </div>
  );
};

export default Panel;
