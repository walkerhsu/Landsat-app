import React, { useState } from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/magicui/resizable";
import { LsText } from "@/components/LsText";
import { NumberTickerComponent } from "../number-ticker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../magicui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../magicui/popover";
import SpectrumChart from "@/components/footer-panel/graph";

interface SrData {
  ndvi: number;
  ndwi: number;
  evi: number;
  savi: number;
  ndmi: number;
  nbr: number;
  nbr2: number;
  ndsi: number;
  b1: number;
  b2: number;
  b3: number;
  b4: number;
  b5: number;
  b6: number;
  b7: number;
  b8: number;
}

interface DataPanelProps {
  label: string;
  value: number;
  description: string;
}

const descriptions = {
  ndvi: "Normalized Difference Vegetation Index: Measures vegetation health and density.",
  ndwi: "Normalized Difference Water Index: Measures water content in vegetation and water bodies.",
  evi: "Enhanced Vegetation Index: An optimized vegetation index with improved sensitivity.",
  savi: "Soil Adjusted Vegetation Index: Minimizes soil brightness influences in vegetation monitoring.",
  ndmi: "Normalized Difference Moisture Index: Measures vegetation water content.",
  nbr: "Normalized Burn Ratio: Used to identify burned areas and assess fire severity.",
  nbr2: "Second Normalized Burn Ratio: An alternative to NBR for burn severity assessment.",
  ndsi: "Normalized Difference Snow Index: Used to detect snow cover.",
};

const DataPanel: React.FC<DataPanelProps> = ({ label, value, description }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <div className="flex h-full items-center justify-center px-4">
          <div style={{ display: "flex",  width: "50%", justifyContent: 'center', margin: "1rem 0", gap: "1rem" }}>
            <div style={{ display: "flex", flexBasis: "20%" }}>
              <LsText>{label}:</LsText>
            </div>
            <div style={{ display: "flex", flexBasis: "80%" }}>
              <NumberTickerComponent value={value} />
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>{description}</TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const DataDisplayPanels: React.FC<{ srData: SrData }> = ({ srData }) => {
  console.log(srData);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="max-w-md rounded-lg border md:min-w-[1250px]"
    >
      {/* Left Column: Spectrum Chart */}
      <ResizablePanel defaultSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={10}>
            <DataPanel
              label="NDVI"
              value={srData.ndvi}
              description={descriptions.ndvi}
            />
          </ResizablePanel>
          <ResizableHandle />
          <SpectrumChart
            bands={[
              srData.b1,
              srData.b2,
              srData.b3,
              srData.b4,
              srData.b5,
              srData.b6,
              srData.b7,
              srData.b8,
            ]}
          />
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle />

      {/* Middle Column: NDVI, NDWI, EVI */}
      <ResizablePanel defaultSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={20}>
            <DataPanel
              label="NDSI"
              value={srData.ndsi}
              description={descriptions.ndsi}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={20}>
            <DataPanel
              label="NDWI"
              value={srData.ndwi}
              description={descriptions.ndwi}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={20}>
            <DataPanel
              label="EVI"
              value={srData.evi}
              description={descriptions.evi}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>

      <ResizableHandle />

      {/* Right Column: SAVI, NDMI, NBR, NBR2, NDSI */}
      <ResizablePanel defaultSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={20}>
            <DataPanel
              label="SAVI"
              value={srData.savi}
              description={descriptions.savi}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={20}>
            <DataPanel
              label="NDMI"
              value={srData.ndmi}
              description={descriptions.ndmi}
            />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={20}>
            <DataPanel
              label="NBR"
              value={srData.nbr}
              description={descriptions.nbr}
            />
          </ResizablePanel>

          <ResizableHandle />
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default DataDisplayPanels;
