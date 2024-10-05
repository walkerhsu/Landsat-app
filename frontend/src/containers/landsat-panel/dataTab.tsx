import React, { useState } from "react";
import styles from "./styles/tab.module.css";
import { LsText } from "@/components/LsText";
import { LsFontSize } from "@/constants/ls-fonts";
import { LsCheckbox } from "@/components/LsCheckbox";
import { NoContentSection } from "@/components/no-content-section";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ITEMS } from "./mockData";
import {
  addLocation,
  setCategory,
  setLocation,
  setSource,
  setTime,
} from "@/app/redux/selectedDataset-slice";

const DataTab: React.FC = () => {
  const dataAttribute = useSelector((state: RootState) => state.dataAttribute);
  const dispatch = useDispatch();
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string;
  }>({});
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleOptionChange = (category: string, option: string) => {
    setSelectedOptions((prev) => ({ ...prev, [category]: option }));
  };

  const filteredItems = ITEMS.filter((item) => {
    const matchesCategory = item.category
      .toLowerCase()
      .includes(dataAttribute.datasetName.toLowerCase());
    const matchesLocation = dataAttribute.locations.some((location) =>
      item.location.toLowerCase().includes(location.toLowerCase())
    );
    return matchesCategory && matchesLocation;
  });

  const handleFilteredItems = (items: typeof ITEMS) => {
    console.log("Filtered Items:", items);
    return items;
  };

  const filteredDataset = handleFilteredItems(filteredItems);

  const displayGridOnMap = (item: any, date: string) => {
    console.log(`displaying grid on map for ${item.category} on ${date} ${item.geoJson.features.geometry}`);
    dispatch(setCategory(item.category));
    dispatch(setLocation({ place: item.location, geoJsons: item.geoJson }));
    dispatch(setSource(item.source));
    dispatch(setTime(date));
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
        {filteredDataset.length > 0 ? (
          filteredDataset.map((item) => (
            <div key={item.category} className={styles.item}>
              <LsText>{item.category}</LsText>
              <LsText size={LsFontSize.Sm}>{item.source}</LsText>
              {item.options.map((date) => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "10px 0px",
                    cursor: "pointer  ",
                  }}
                  key={date}
                  onClick={() => displayGridOnMap(item, date)}
                >
                  <LsCheckbox
                    checked={selectedOptions[item.category] === date}
                    onChange={() => handleOptionChange(item.category, date)}
                  />
                  <LsText key={date} size={LsFontSize.Sm}>
                    {date}
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
