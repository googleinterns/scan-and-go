import React from "react";
import { useTheme } from "@material-ui/core/styles";

function StoreCardMedia({ media, height }: { media: string; height?: number }) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  return (
    <img
      src={media}
      style={{
        borderRadius: "50%",
        height: height,
        width: height,
        marginRight: themeSpacing,
      }}
    />
  );
}

export default StoreCardMedia;
