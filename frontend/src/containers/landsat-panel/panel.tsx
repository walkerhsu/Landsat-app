import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { setFetchStatus } from "@/app/redux/fetchStatus-slice";
import { useDispatch } from "react-redux";
const TABS = ["Filters", "Locations", "Data"];

const Panel: React.FC = () => {
  const dataAttributes = useSelector((state: RootState) => state.dataAttribute);
  const fetchStatus = useSelector((state: RootState) => state.fetchStatus);
  const mapApi = useMemo(() => MapApi.create(), []);
  const [activeTab, setActiveTab] = useState("Filters");
  const [mode, setMode] = useState<"edit" | "read">("edit");
  const [queryDataset, setQueryDataset] = useState<MapModel[]>([]);
  const [loading, setLoading] = useState(false);

  const [panelWidth, setPanelWidth] = useState("17rem");
  const dispatch = useDispatch();
  useEffect(() => {
    setPanelWidth(mode === "edit" ? "17rem" : "40rem");
  }, [mode]);

  const handleTabClick = (tab: string) => {
    if (mode === "edit") {
      setActiveTab(tab);
    }
  };

  const toggleMode = (newMode: "edit" | "read") => {
    setMode(newMode);
  };

  useEffect(() => {
    console.log("Fetch status:", fetchStatus.isFetching);
    // setMode(fetchStatus.isFetching ? "read" : "edit");
  }, [fetchStatus]);

  const handleQueryDataset = useCallback(async () => {
    console.log("Querying dataset...");
    dispatch(setFetchStatus({ isFetching: true }));
    setLoading(true);
    const [error, returnedMapDataset] = await mapApi.fetchMapDatasets(
      dataAttributes.timespan.startDate,
      dataAttributes.timespan.endDate,
      dataAttributes.locations,
      dataAttributes.cloudCoverage
    );

    setLoading(false);
    dispatch(setFetchStatus({ isFetching: false }));
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
      {fetchStatus.isFetching ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <LsIcon name={LsIconName.Loading} size="40px" />
        </div>
      ) : (
        <>
          {activeTab === TABS[0] && <FiltersTab isEditMode={true} />}
          {activeTab === TABS[1] && <LocationsTab isEditMode={true} />}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: "10px",
            }}
          >
            {loading ? (
              <LsIcon name={LsIconName.Processing} size="28px" />
            ) : activeTab === TABS[1] ? (
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
            ) : null}
          </div>
        </>
      )}
    </>
  );

  const renderReadMode = () => (
    <>
      {/* <div style={{ display: "flex", width: "30rem" }}></div> */}
      <div
        style={{
          display: "grid",
          maxWidth: "45vw",
          maxHeight: "50vh",
          padding: `${8}px`,
          gridTemplateColumns: `repeat(${2}, 1fr)`,
          flexFlow: "column wrap",
          gap: `${24}px`,
          overflow: "auto",
          overflowWrap: "break-word",
        }}
      >
        {fetchStatus.isFetching ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <LsIcon name={LsIconName.Loading} size="40px" />
          </div>
        ) : (
          <>
            <div style={{ display: "flex", flexBasis: "50%" }}>
              <LocationsTab isEditMode={false} />
            </div>
            <div style={{ display: "flex", flexBasis: "50%" }}>
              <DataTab isEditMode={false} queryDataset={queryDataset} />
            </div>
          </>
        )}
      </div>
    </>
  );

  return (
    <div style={{ display: "flex" }}>
      <div
        className={styles.panel}
        style={{
          width: panelWidth,
          transition: "width 0.3s ease-in-out",
        }}
      >
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
