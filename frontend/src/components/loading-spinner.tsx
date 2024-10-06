import { cn } from "@/lib/utils";
import { Icons } from "./icons";

export const LoadingSpinner: React.FC = () => {
  return (
    // <svg
    //   xmlns="http://www.w3.org/2000/svg"
    //   width="24"
    //   height="24"
    //   viewBox="0 0 24 24"
    //   fill="none"
    //   stroke="currentColor"
    //   strokeWidth="2"
    //   strokeLinecap="round"
    //   strokeLinejoin="round"
    //   className={cn("animate-spin", "mr-2 h-4 w-4 animate-spin")}
    // >
    //   <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    // </svg>
    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
  );
};
