import React from 'react';
import Link from 'next/link';
import styles from '@/components/styles/drawer.module.css';
import { FaChevronRight } from 'react-icons/fa';


interface DrawerProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onToggle }) => {
  return (
    <>
      <div className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
      <button className={styles.toggleButton} onClick={onToggle}>
        <FaChevronRight />
      </button>
      <div className={styles.drawerContent}>
        <Link href="/report" className={styles.drawerItem}>Report</Link>
        <Link href="/profile" className={styles.drawerItem}>Profile</Link>
      </div>
      </div>
      {isOpen && <div className={styles.overlay} onClick={onToggle}></div>}
    </>
  );
};

export default Drawer;