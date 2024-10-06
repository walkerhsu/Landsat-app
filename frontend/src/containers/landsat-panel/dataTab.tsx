import React, { useState } from "react";
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

type DataProps = {
  isEditMode: boolean;
  queryDataset: MapModel[];
};

const DataTab: React.FC<DataProps> = ({ isEditMode, queryDataset }) => {
  // const dataAttribute = useSelector((state: RootState) => state.dataAttribute);
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleOptionChange = (category: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: option }));
  };

  // READ
  // const filteredItems = ITEMS.filter((item) => {
  //   const matchesCategory = item.category
  //     .toLowerCase()
  //     .includes(dataAttribute.datasetName.toLowerCase());
  //   const matchesLocation = dataAttribute.locations.some((location) =>
  //     item.location.toLowerCase().includes(location.toLowerCase())
  //   );
  //   return matchesCategory && matchesLocation;
  // });

  // const handleFilteredItems = (items: typeof ITEMS) => {
  //   console.log("Filtered Items:", items);
  //   return items;
  // };

  // const filteredDataset = handleFilteredItems(filteredItems);

  const displayGridOnMap = (data: DatasetModel, location: TLocation) => {
    console.log(
      `displaying grid on map for ${data.getId()} on ${data.getDate()}`
    );
    // selectedDataset
    dispatch(setDatasetID(data.getId()));
    dispatch(setLocation(location));
    // dispatch(setSource(data.source));
    // dispatch(setTime(data.time));
  };

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "column",
        width: "100%",
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
      <div style={{ flexGrow: "1", maxHeight: "25rem", overflowY: "auto" }}>
        {queryDataset.length > 0 ? (
          queryDataset.map((item) => (
            <div key={item.getDataset()?.[0]?.getId()} className={styles.item}>
              <LsText>{item.getCollectionName()}</LsText>
              {/* <LsText size={LsFontSize.Sm}>{item.source}</LsText> */}
              {item.getDataset().map((data) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "10px 0px",
                    cursor: "pointer  ",
                  }}
                  key={data.getId()}
                  onClick={() => displayGridOnMap(data, item.getLocation())}
                >
                  <LsCheckbox
                    checked={
                      selectedOptions[item.getCollectionName()] ===
                      data.getDate()
                    }
                    onChange={() =>
                      handleOptionChange(
                        item.getCollectionName(),
                        data.getDate()
                      )
                    }
                  />
                  <LsText key={data.getId()} size={LsFontSize.Sm}>
                    {data.getDate()}
                  </LsText>
                </div>
              ))}
            </div>
          ))
        ) : (
          <NoContentSection message="There is no data found" />
        )}
      </div>
    </div>
  );
};

export default DataTab;
