import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { themeConfig } from "src/theme";
import { Paper } from "@material-ui/core";
import "src/css/animation.css";

function InfoCardMedia({
  media,
  maxHeight,
  variant,
  placeholder,
}: {
  media: string;
  maxHeight?: number;
  variant?: "rounded" | "circle" | undefined;
  placeholder?: boolean | undefined;
}) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  const DEFAULT_IMG_HEIGHT = themeConfig.default_card_img_height;

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
      });
    }
  };

  return (
    <Paper
      elevation={2}
      style={{
        borderRadius: imgBorderRadius,
        height: DEFAULT_IMG_HEIGHT,
        width: DEFAULT_IMG_HEIGHT,
        maxHeight: maxHeight,
        maxWidth: maxHeight,
        overflow: "hidden",
        marginRight: theme.spacing(1),
      }}
      className={placeholder ? "idle-gradient" : undefined}
    >
      <img
        id="info-card-media-imgSrc"
        src={media}
        style={imgStyle}
        onLoad={imgAutoSize}
      />
    </Paper>
  );
}

export default InfoCardMedia;
