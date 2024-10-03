import { LsColor } from "@/constants/ls-color";
import React, { useState } from "react";
import { LsText } from "../LsText";
import { LsIcon } from "../LsIcon";
import { LsIconName } from "@/constants/ls-icon";
import { useRouter } from "next/navigation";

const Routes = [
  "Settings",
  "Notifications",
  "Profile",
  "Log In",
  "Log Out",
  "Sign Up",
];

const ExpandableButton: React.FC = () => {
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
      case "Log In":
        router.push("/login");
        break;
      case "Log Out":
        router.push("/logout");
        break;
      case "Sign Up":
        router.push("/signup");
        break;
      case "Settings":
        router.push("/settings");
        break;
      default:
        break;
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "16px", right: "16px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "8px",
        }}
      >
        {Routes.map((action, index) => (
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
