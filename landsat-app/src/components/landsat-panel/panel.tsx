import React, { useState } from 'react';
import styles from './styles/panel.module.css';
import DataTab from './dataTab';
import LocationsTab from './locationsTab';
import FiltersTab from './filtersTab';

const TABS = ["Filters", "Locations", "Data"];

const Panel: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Data");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.panel}>
      {/* Tabs */}
      <div className={styles.tabs}>
        {TABS.map(tab => (
          <button
            key={tab}
            className={`${styles.tabButton} ${activeTab === tab ? styles.active : ''}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Conditional content rendering based on the active tab */}
      {activeTab === TABS[0] && <FiltersTab />}
      {activeTab === TABS[1] && <LocationsTab />}
      {activeTab === TABS[2] && <DataTab />}

      {/* Footer with Download Button */}
      {activeTab === TABS[2] && (
        <div style={{display: 'flex', justifyContent: 'center', paddingTop: '10px'}}>
          <button className={styles.downloadButton}>Download via Earthdata Search</button>
        </div>
      )}
    </div>
  );
};

export default Panel;