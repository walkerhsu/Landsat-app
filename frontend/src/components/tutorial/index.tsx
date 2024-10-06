import React, { useState } from "react";
import styles from "./styles/tutorial.module.css";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/magicui/pagination";

interface TutorialStep {
  title: string;
  description: string;
  image: string;
}

const tutorialSteps: TutorialStep[] = [
  {
    title: "Welcome to the Earth Pixel",
    description:
      "This tutorial will guide you through the main features of our app.",
    image: "1.jpg",
  },
  {
    title: "Location Panel",
    description: "Following the four steps can query the data you want.",
    image: "2.jpg",
  },
  {
    title: "Geojson data",
    description: "Select the dataset you want to show on the map.",
    image: "3.jpg",
  },
  {
    title: "Show Surface Reflectance",
    description:
      "Click on the pixel data to show the related surface reflectance data.",
    image: "4.jpg",
  },
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
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>{tutorialSteps[currentStep].title}</h2>
        <img
          src={tutorialSteps[currentStep].image}
          alt={tutorialSteps[currentStep].title}
          className={styles.image}
        />
        <p className={styles.description}>
          {tutorialSteps[currentStep].description}
        </p>

        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={handlePrevious} />
            </PaginationItem>

            {tutorialSteps.map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => setCurrentStep(index)}
                  isActive={currentStep === index}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext onClick={handleNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
