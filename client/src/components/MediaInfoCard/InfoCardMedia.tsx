import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { themeConfig } from "src/theme";
import AutoSizeMedia from "src/components/AutoSizeMedia";
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

  return (
    <div
      style={{
        marginRight: theme.spacing(1),
      }}
      className={placeholder ? "idle-gradient" : undefined}
    >
      <AutoSizeMedia
        elevation={2}
        media={media}
        maxHeight={maxHeight}
        variant={variant}
        onClick={onClick}
      />
    </div>
  );
}

export default InfoCardMedia;
