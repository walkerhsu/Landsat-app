import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./styles/tab.module.css";
import { LsText } from "@/components/LsText";
import { LsFontSize } from "@/constants/ls-fonts";
import { LsCheckbox } from "@/components/LsCheckbox";
import { NoContentSection } from "@/components/no-content-section";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ITEMS } from "./mockData";
import { setDatasetID, setLocation } from "@/app/redux/selectedDataset-slice";
import { MapModel } from "@/models/map-model";
import { DatasetModel } from "@/models/dataset-model";
import { TLocation } from "@/types";
import { formatLocationId, parseLocationId } from "../utils/format-locations";
import { LsIconName } from "@/constants/ls-icon";
import { LsIcon } from "@/components/LsIcon";
import { LsColor } from "@/constants/ls-color";
import { DatasetLocation, MapApi } from "@/apis/map-api";

type DataProps = {
  isEditMode: boolean;
  queryDataset: MapModel[];
};

const DataTab: React.FC<DataProps> = ({ isEditMode, queryDataset }) => {
  const mapApi = useMemo(() => new MapApi(), []);
  const checkedItems = useSelector(
    (state: RootState) => state.checkedItems.checkedItems
  );
  const dispatch = useDispatch();
  const [checkedDatasetId, setCheckedDatasetId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [hovered, setHovered] = useState<string>("");

  // DOWNLOAD
  const handleDownloadDataset = useCallback(
    async (datasetLocation: DatasetLocation) => {
      console.log("Downloading dataset...");
      const error = await mapApi.downloadDataset(datasetLocation);
      if (error) {
        return;
      }
      console.log("Successfully downloaded dataset");
    },
    [mapApi]
  );

  const displayGridOnMap = (dataId: string, location: TLocation) => {
    console.log(`displaying grid on map for ${dataId} on ${location}`);
    // selectedDataset
    dispatch(setDatasetID(dataId));
    dispatch(setLocation(location));
    // dispatch(setSource(data.source));
    // dispatch(setTime(data.time));
  };
  const [uniqueFilteredDatasets, setUniqueFilteredDatasets] = useState<
    MapModel[] | null
  >(null);

  useEffect(() => {
    function removeDuplicateDatasets(datasets: MapModel[]): MapModel[] {
      const uniqueDatasets = new Map<string, MapModel>();

      datasets.forEach((mapModel) => {
        mapModel.getDataset().forEach((dataset) => {
          if (!uniqueDatasets.has(dataset.getId())) {
            uniqueDatasets.set(dataset.getId(), mapModel);
          }
        });
      });

      return Array.from(uniqueDatasets.values());
    }

    const filterByLocation = queryDataset.filter((dataset) => {
      return checkedItems.includes(
        formatLocationId(dataset.getLocation().lat, dataset.getLocation().lng)
      );
    });

    setUniqueFilteredDatasets(removeDuplicateDatasets(filterByLocation));

    console.log(queryDataset, uniqueFilteredDatasets, checkedItems);
  }, [checkedItems]);

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        width: "24vw",
        height: "100%",
      }}
    >
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search data..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div
        style={{
          flexGrow: "1",
          maxWidth: "50rem",
          maxHeight: "25rem",
          overflowY: "auto",
        }}
      >
        {uniqueFilteredDatasets && uniqueFilteredDatasets.length > 0 ? (
          uniqueFilteredDatasets.map((location, index) => (
            // one location multiple data
            <div
              key={location.getDataset()?.[index]?.getId()}
              style={
                {
                  // display: "flex",
                }
              }
            >
              <LsText>{location.getCollectionName()}</LsText>
              {/* <LsText size={LsFontSize.Sm}>{item.source}</LsText> */}
              {location.getDataset().map((data) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    padding: "10px 10px",
                    cursor: "pointer",
                    background:
                      hovered === data.getId()
                        ? LsColor.Grey500
                        : "transparent",
                    borderRadius: "1rem",
                  }}
                  key={data.getId()}
                  onClick={() =>
                    displayGridOnMap(data.getId(), location.getLocation())
                  }
                  onMouseEnter={() => setHovered(data.getId())}
                  onMouseLeave={() => setHovered("")}
                >
                  <LsText size={LsFontSize.Xs}>{data.getId()}</LsText>
                  <LsText key={data.getId()} size={LsFontSize.Sm}>
                    {data.getDate()}
                  </LsText>
                  <LsCheckbox
                    checked={checkedDatasetId === data.getId()}
                    onChange={() => setCheckedDatasetId(data.getId())}
                  />
                </div>
              ))}
            </div>
          ))
        ) : (
          <NoContentSection message="There is no data found" />
        )}

        <div
          style={{
            // width: "30rem",
            display: "flex",
            justifyContent: "center",
            paddingTop: "10px",
          }}
        >
          <button
            className={styles.downloadButton}
            onClick={() =>
              handleDownloadDataset({
                datasetID: checkedDatasetId!,
                location: parseLocationId(checkedItems[0]),
              })
            }
          >
            <LsIcon
              name={LsIconName.ArrowBottom}
              color={LsColor.White}
              size={"24px"}
            />
            <LsText size={LsFontSize.Sm}>Download via Earthdata Search</LsText>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTab;
