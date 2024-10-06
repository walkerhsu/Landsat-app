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
  const [activeTab, setActiveTab] = useState("Data");
  const [mode, setMode] = useState<"edit" | "read">("read");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleMode = (newMode: "edit" | "read") => {
    setMode(newMode);
  };

  const [queryDataset, setQueryDataset] = useState<MapModel[]>([]);
  const [loading, setLoading] = useState(false);

  const handleQueryDataset = useCallback(async () => {
    console.log("Querying dataset...");
    setLoading(true);
    // try {
      const [error, returnedMapDataset] = await mapApi.fetchMapDatasets(
        dataAttributes.timespan.startDate,
        dataAttributes.timespan.endDate,
        dataAttributes.locations,
        // [
        //   { lat: 0, lng: 0 },
        //   { lat: 1, lng: 1 },
        // ]
        dataAttributes.cloudCoverage
      );

      console.log(error, returnedMapDataset);
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
    // } catch (err) {
    //   setLoading(false);
    //   console.error("Unexpected error occurred:", err);
    // }
  }, [mapApi, dataAttributes, setQueryDataset, toggleMode]);

  const handleDownloadDataset = () => {
    console.log("Downloading dataset...");
  };

  return (
    <div style={{ display: "flex" }}>
      <div className={styles.panel}>
        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tabButton} ${
                activeTab === tab ? styles.active : ""
              }`}
              onClick={() => handleTabClick(tab)}
            >
              <LsText
                color={activeTab === tab ? LsColor.White : LsColor.Grey400}
              >
                {tab}
              </LsText>
            </button>
          ))}
        </div>

        {/* Conditional content rendering based on the active tab */}
        {activeTab === TABS[0] && <FiltersTab isEditMode={mode === "edit"} />}
        {activeTab === TABS[1] && <LocationsTab isEditMode={mode === "edit"} />}
        {activeTab === TABS[2] && (
          <DataTab isEditMode={mode === "edit"} queryDataset={queryDataset} />
        )}

        {/* Footer with Download Button */}
        {mode === "edit" && activeTab !== TABS[2] && (
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
              <button
                className={styles.queryButton}
                onClick={handleQueryDataset}
              >
                <LsIcon
                  name={LsIconName.Search}
                  color={LsColor.White}
                  size={"24px"}
                />
                <LsText>Query Dataset</LsText>
              </button>
            )}
          </div>
        )}
        {mode === "read" && activeTab === TABS[2] && (
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
              <LsText size={LsFontSize.Sm}>
                Download via Earthdata Search
              </LsText>
            </button>
          </div>
        )}
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
