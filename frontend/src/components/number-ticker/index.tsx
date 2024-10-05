import NumberTicker from "@/components/magicui/number-ticker";
import { LsColor } from "@/constants/ls-color";
import React from "react";

interface NumberTickerProps {
  value: number;
  color?: LsColor;
  direction?: "down" | "up";
  decimalPlaces?: number;
}

export const NumberTickerComponent: React.FC<NumberTickerProps> = ({
  value,
  color = LsColor.White,
  direction = "up",
  decimalPlaces = 2,
}) => {
  return (
    <p
      className="whitespace-pre-wrap text-8xl font-medium tracking-tighter text-white dark:text-white"
    >
      <NumberTicker
        className=" text-white dark:text-white"
        value={value}
        direction={direction}
        decimalPlaces={decimalPlaces}
      />
    </p>
  );
};
