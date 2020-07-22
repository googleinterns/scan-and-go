import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";
import { themeConfig } from "src/theme";

function AutoSizeMedia({
  elevation,
  media,
  maxHeight,
  variant,
  onClick,
  fullWidth,
}: {
  elevation?: number;
  media: string;
  maxHeight?: number | string;
  variant?: "rounded" | "circle" | undefined;
  onClick?: () => void;
  fullWidth?: boolean;
}) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  const DEFAULT_IMG_HEIGHT = fullWidth
    ? "100vw"
    : themeConfig.default_card_img_height;

  let imgBorderRadius = "0%";
  // Parse css style given props
  if (variant === "rounded") {
    imgBorderRadius = "10%";
  } else if (variant === "circle") {
    imgBorderRadius = "50%";
  }

  // Default css styling
  const [imgStyle, setImgStyle] = useState({});

  // This callback waits for image data to load from bytes
  // then determine which axis to constrain image
  // if height > width, constrain by width
  // else, constrain by height
  const imgAutoSize = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const imgSrcRef = event.currentTarget;
    if (imgSrcRef) {
      const constrainByHeight = imgSrcRef.height <= imgSrcRef.width;
      setImgStyle({
        height: constrainByHeight ? DEFAULT_IMG_HEIGHT : "auto",
        width: constrainByHeight ? "auto" : DEFAULT_IMG_HEIGHT,
        maxHeight: constrainByHeight ? maxHeight : "auto",
        maxWidth: constrainByHeight ? "auto" : maxHeight,
        cursor: onClick ? "pointer" : "default",
      });
    }
  };

  return (
    <Paper
      elevation={elevation}
      style={{
        borderRadius: imgBorderRadius,
        height: DEFAULT_IMG_HEIGHT,
        width: DEFAULT_IMG_HEIGHT,
        maxHeight: maxHeight,
        maxWidth: maxHeight,
        overflow: "hidden",
      }}
    >
      <img
        src={media}
        style={imgStyle}
        onLoad={imgAutoSize}
        onClick={onClick ? () => onClick() : undefined}
      />
    </Paper>
  );
}

export default AutoSizeMedia;
