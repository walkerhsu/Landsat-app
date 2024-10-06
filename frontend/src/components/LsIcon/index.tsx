import { Icon } from "@iconify/react";
import * as React from "react";
import { LsColor } from "@/constants/ls-color";
import { LsIconName } from "@/constants/ls-icon";

interface Props {
  name: LsIconName;
  color?: LsColor;
  size?: "40px" | "28px" | "24px" | "20px" | "16px" | "12px";
}

export function LsIcon({ name, color = LsColor.White, size = "16px" }: Props) {
  switch (name) {
    case LsIconName.Up:
      return <Icon icon="mingcute:up-line" color={color} fontSize={size} />;
    case LsIconName.Down:
      return <Icon icon="mingcute:down-line" color={color} fontSize={size} />;
    case LsIconName.Logout:
      return <Icon icon="websymbol:logout" color={color} fontSize={size} />;
    case LsIconName.Save:
      return (
        <Icon
          icon="line-md:circle-to-confirm-circle-transition"
          color={color}
          fontSize={size}
        />
      );
    case LsIconName.Upload:
      return <Icon icon="prime:cloud-upload" color={color} fontSize={size} />;
    case LsIconName.Profile:
      return (
        <Icon
          icon="iconamoon:profile-circle-fill"
          color={color}
          fontSize={size}
        />
      );
    case LsIconName.Search:
      return (
        <Icon
          icon="bitcoin-icons:search-outline"
          color={color}
          fontSize={size}
        />
      );
    case LsIconName.Plus:
      return <Icon icon="lets-icons:add-round" color={color} fontSize={size} />;
    case LsIconName.Processing:
      return (
        <Icon
          icon="eos-icons:three-dots-loading"
          color={color}
          fontSize={size}
        />
      );
    case LsIconName.Loading:
      // three dots loading in the middle of the screen in a circle
      return (
        <Icon
          icon="eos-icons:bubble-loading"
          color={color}
          fontSize={size}
        />
      );
    case LsIconName.Close:
      return <Icon icon="majesticons:close" color={color} fontSize={size} />;
    case LsIconName.Edit:
      //   return <Icon icon="la:edit" color={color} fontSize={size} />;
      return (
        <Icon icon="fluent:edit-48-regular" color={color} fontSize={size} />
      );
    case LsIconName.Delete:
      return (
        <Icon icon="fluent:delete-24-regular" color={color} fontSize={size} />
      );
    case LsIconName.Duplicate:
      return <Icon icon="bx:duplicate" color={color} fontSize={size} />;
    case LsIconName.Check:
      return <Icon icon="gravity-ui:check" color={color} fontSize={size} />;
    case LsIconName.Animation:
      return (
        <Icon icon="icon-park-outline:play" color={color} fontSize={size} />
      );
    case LsIconName.Crown:
      return <Icon icon="peLsons-pop:crown" color={color} fontSize={size} />;
    case LsIconName.Undo:
      return (
        <Icon icon="iconamoon:do-undo-light" color={color} fontSize={size} />
      );
    case LsIconName.Redo:
      return <Icon icon="iconoir:redo" color={color} fontSize={size} />;
    case LsIconName.List:
      return <Icon icon="charm:menu-hamburger" color={color} fontSize={size} />;
    case LsIconName.BulletedList:
      return <Icon icon="tabler:list" color={color} fontSize={size} />;
    case LsIconName.ArrowTop:
      return <Icon icon="bx:arrow-to-top" color={color} fontSize={size} />;
    case LsIconName.ArrowBottom:
      return <Icon icon="bx:arrow-to-bottom" color={color} fontSize={size} />;
    case LsIconName.View:
      return <Icon icon="ci:show" color={color} fontSize={size} />;
    case LsIconName.Hide:
      return <Icon icon="mdi:hide-outline" color={color} fontSize={size} />;
    default:
      return <></>;
  }
}
