import React from "react";
import styles from "./profile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Mapbox from "../../containers/mapbox/mapbox";
import { TLocation } from "@/types";

interface MapModalProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedLocation: TLocation | null;
  onLocationSelect: (location: TLocation) => void;
}

const MapModal: React.FC<MapModalProps> = ({
  show,
  onClose,
  onConfirm,
  selectedLocation,
  onLocationSelect,
}) =>
  show && (
    <div className={styles.mapModal}>
      <div className={styles.mapModalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <Mapbox
          location={selectedLocation}
          onLocationSelect={onLocationSelect}
        />
        <div className={styles.mapButtonGroup}>
          <button className={styles.confirmButton} onClick={onConfirm}>
            Confirm
          </button>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

export default MapModal;
