import React, { useState } from 'react';
import styles from './styles/tab.module.css';
import { LsText } from '@/components/LsText';
import { LsFontSize } from '@/constants/ls-fonts';
import { LsCheckbox } from '@/components/LsCheckbox';
import { NoContentSection } from '../no-content-section';

const ITEMS = [
  {
    category: "Landsat 8-9 OLI/TIRS C2 L1",
    source: "NOAA-20 / VIIRS",
    options: ["2024-09-01", "2024-09-05", "2024-09-10"]
  },
  {
    category: "Landsat 8-9 OLI/TIRS C2 L2",
    source: "IMERG",
    options: ["2024-09-02", "2024-09-06", "2024-09-11"]
  },
];

const DataTab: React.FC = () => {
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleOptionChange = (category: string, option: string) => {
    setSelectedOptions(prev => ({ ...prev, [category]: option }));
  };

  const filteredItems = ITEMS.filter(item =>
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.source.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{display: 'flex', flexFlow: 'column', width: '100%', height: '100%'}}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search data..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />
      <div style={{ flexGrow: '1', maxHeight: '25rem', overflowY: 'auto'}}>
      {filteredItems.length > 0 ? (
        filteredItems.map(item => (
          <div key={item.category} className={styles.item}>
            <LsText>{item.category}</LsText>
            <LsText size={LsFontSize.Sm}>{item.source}</LsText>
            {item.options.map(option => (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '10px 0px' }} key={option}>
                <LsCheckbox
                  checked={selectedOptions[item.category] === option}
                  onChange={() => handleOptionChange(item.category, option)}
                />
                <LsText key={option} size={LsFontSize.Sm}>
                  {option}
                </LsText>
              </div>
            ))}
          </div>
        ))
      ) : (
        <NoContentSection message='There is no data found'/>
      )}
    </div>
    </div >
  );
};

export default DataTab;
