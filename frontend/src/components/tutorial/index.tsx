// create a tutorial modal that will be displayed when the user clicks the tutorial button
// the modal will have a close on the top right
// the modal will have a title and a description
// the modal will have a image
// the modal will have a next / previous button
// the modal will have a complete button
import React, { useState } from 'react';
import styles from './styles/tutorial.module.css';

interface TutorialStep {
  title: string;
  description: string;
  image: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to the Earth Pixel",
    description: "This tutorial will guide you through the main features of our app.",
    image: "/default_profile.jpg",
  },
  {
    title: "Location Panel",
    description: "Following the four steps can query the data you want.",
    image: "/landsat_image.jpeg",
  },
  {
    title: "Geojson data",
    description: "Select the dataset you want to show on the map.",
    image: "/default_profile.jpg",
  },
  {
    title: "Show Surface Reflectance",
    description: "Click on the pixel data to show the related surface reflectance data.",
    image: "/landsat_image.jpeg",
  },
  // Add more steps as needed
];

export default function Tutorial({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.title}>{tutorialSteps[currentStep].title}</h2>
        <img 
          src={tutorialSteps[currentStep].image} 
          alt={tutorialSteps[currentStep].title} 
          className={styles.image}
        />
        <p className={styles.description}>{tutorialSteps[currentStep].description}</p>
        <div className={styles.navigation}>
          <button 
            onClick={handlePrevious} 
            disabled={currentStep === 0}
            className={styles.navButton}
          >
            Previous
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentStep === tutorialSteps.length - 1}
            className={styles.navButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}