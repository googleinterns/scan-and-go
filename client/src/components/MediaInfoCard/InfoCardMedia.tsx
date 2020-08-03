import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { themeConfig } from "src/theme";
import "src/css/animation.css";

function InfoCardMedia({
  media,
  maxHeight,
  variant,
  placeholder,
  onClick,
}: {
  media: string;
  maxHeight?: number | string;
  variant?: "rounded" | "circle" | undefined;
  placeholder?: boolean | undefined;
  onClick?: () => void;
}) {
  const theme = useTheme();

  const DEFAULT_IMG_HEIGHT = themeConfig.default_card_img_height;
  const DEFAULT_IMG_MINHEIGHT = themeConfig.default_card_img_minHeight;

  let imgBorderRadius = "0%";
  // Parse css style given props
  if (variant === "rounded") {
    imgBorderRadius = "10%";
  } else if (variant === "circle") {
    imgBorderRadius = "50%";
  }

  const imgWrapperStyle = {
    borderRadius: imgBorderRadius,
    height: DEFAULT_IMG_HEIGHT,
    width: DEFAULT_IMG_HEIGHT,
    minHeight: DEFAULT_IMG_MINHEIGHT,
    minWidth: DEFAULT_IMG_MINHEIGHT,
    maxHeight: maxHeight,
    maxWidth: maxHeight,
    marginRight: theme.spacing(1),
  };

  if (onClick) {
    Object.assign(imgWrapperStyle, { cursor: onClick ? "pointer" : "default" });
  }

  return (
    <Paper
      elevation={2}
      style={imgWrapperStyle}
      className={placeholder ? "idle-gradient" : undefined}
    >
      {media && (
        <img
          src={media}
          style={{
            borderRadius: imgBorderRadius,
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          onClick={onClick ? () => onClick() : undefined}
        />
      )}
    </Paper>
  );
}

export default InfoCardMedia;
