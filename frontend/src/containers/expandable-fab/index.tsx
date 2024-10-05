import { LsColor } from "@/constants/ls-color";
import React, { useState } from "react";
import { LsText } from "../../components/LsText";
import { LsIcon } from "../../components/LsIcon";
import { LsIconName } from "@/constants/ls-icon";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/clerk-react";

const Routes = [
  "Profile",
  "Notifications",
  "Sign In",
  "Sign Up",
  "Log Out",
  "Report",
];

const ExpandableButton: React.FC = () => {
  const { user } = useUser()
  const { signOut } = useClerk();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const gotoSettingsPage = (action: string) => {
    switch (action) {
      case "Profile":
        router.push(`/profile`);
        break;
      case "Notifications":
        router.push(`/profile/${action.toLowerCase()}`);
        break;
      case "Sign In":
        router.push("/sign-in");
        break;
      case "Log Out":
        signOut({ redirectUrl: "/" });
        break;
      case "Sign Up":
        router.push("/sign-up");
        break;
      case "Settings":
        router.push("/settings");
        break;
      default:
        break;
    }
  };

  const effectiveRoutes = user?.id
    ? Routes.filter((route) => route !== "Sign In" && route !== "Sign Up")
    : Routes.filter((route) => route !== "Log Out");

  return (
    <div style={{ position: "fixed", bottom: "3rem", right: "1rem" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "8px",
        }}
      >
        {effectiveRoutes.map((action, index) => (
          <button
            key={action}
            style={{
              backgroundColor: LsColor.SteelBlue,
              color: "black",
              padding: "8px",
              borderRadius: "8px",
              marginBottom: "8px",
              opacity: isExpanded ? 1 : 0,
              transform: isExpanded ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.3s ease, transform 0.3s ease",
              visibility: isExpanded ? "visible" : "hidden",
              transitionDelay: `${index * 50}ms`,
            }}
            onClick={() => gotoSettingsPage(action)}
          >
            <LsText>{action}</LsText>
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "8px",
        }}
      >
        <button
          onClick={toggleExpand}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: LsColor.DarkBlue,
            color: "white",
            padding: "16px",
            borderRadius: "10px",
            transition: "transform 0.3s ease",
            width: "4rem",
            height: "4rem",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          {isExpanded ? (
            <LsIcon name={LsIconName.Up} size={"24px"} />
          ) : (
            <LsIcon name={LsIconName.Up} size={"24px"} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ExpandableButton;
