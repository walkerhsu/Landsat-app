import { CalendarIcon, FileTextIcon } from "@radix-ui/react-icons";
import { BellIcon, Share2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import Marquee from "@/components/magicui/marquee";
import { NoContentSection } from "../no-content-section";

export interface SR_data {
  color: string;
  ndvi: number;
  ndwi: number;
  evi: number;
  savi: number;
  ndmi: number;
  nbr: number;
  nbr2: number;
  ndsi: number;
  temperature: number;
}

const mockSRData: SR_data = {
  color: "#FF5733", // Example color (Hex code)
  ndvi: 0.78, // NDVI value
  ndwi: 0.62, // NDWI value
  evi: 0.55, // EVI value
  savi: 0.72, // SAVI value
  ndmi: 0.45, // NDMI value
  nbr: 0.6, // NBR value
  nbr2: 0.4, // NBR2 value
  ndsi: 0.1, // NDSI value
  temperature: 298.15, // Temperature in Kelvin
};

const descriptions = {
  ndvi: "Normalized Difference Vegetation Index: Measures vegetation health.",
  ndwi: "Normalized Difference Water Index: Indicates water content.",
  evi: "Enhanced Vegetation Index: Alternative vegetation health measure.",
  savi: "Soil Adjusted Vegetation Index: Adjusts for soil brightness.",
  ndmi: "Normalized Difference Moisture Index: Monitors moisture levels.",
  nbr: "Normalized Burn Ratio: Used to assess fire-affected areas.",
  nbr2: "Normalized Burn Ratio 2: Alternate burn index.",
  ndsi: "Normalized Difference Snow Index: Measures snow cover.",
  temperature: "Surface Temperature: Indicates temperature of the surface.",
};

type Props = {
  srData: SR_data;
};

export const SRDataDisplay: React.FC<Props> = ({ srData = mockSRData }) => {
  if (!srData) {
    return <NoContentSection message="There is no SR Data Available" />;
  }

  const features = Object.keys(srData).map((key) => ({
    Icon: FileTextIcon, // You can customize icons for each feature
    name: key.toUpperCase(),
    description: descriptions[key] || "Description not available.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee
        pauseOnHover
        className="absolute top-10 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]"
      >
        <figure
          className={cn(
            "relative w-32 cursor-pointer overflow-hidden rounded-xl border p-4",
            // light mode
            "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
            // dark mode
            "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            "transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none"
          )}
        >
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col">
              <figcaption className="text-sm font-medium dark:text-white">
                {srData[key as keyof typeof srData]}
              </figcaption>
            </div>
          </div>
          <blockquote className="mt-2 text-xs">
            {srData[key as keyof typeof srData]}
          </blockquote>
        </figure>
      </Marquee>
    ),
  }));

  const MarqueeFeatureDisplay = () => {
    return (
      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} {...feature} />
        ))}
      </BentoGrid>
    );
  };
};
