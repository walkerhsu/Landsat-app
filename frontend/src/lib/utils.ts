import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const deduplicateArray = <T, K extends number | string>(arr: T[], identifier: (item: T) => K): T[] => {
  const map = new Map<string, T>();
  arr.forEach((item) => map.set(identifier(item).toString(), item));
  return Array.from(map.values());
};
