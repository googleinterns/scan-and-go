import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Paper } from "@material-ui/core";

function ItemCardMedia({
  media,
  height,
  maxHeight,
}: {
  media: string;
  height?: number | string;
  maxHeight?: number | string;
}) {
  const theme = useTheme();

  const [imgStyle, setImgStyle] = useState({});

  // This hook is to wait for image data to load from bytes
  // then determine which axis to constrain image
  // if height > width, constrain by width
  // else, constrain by height
  useEffect(() => {
    const imgSrcRef = document.getElementById(
      "item-card-media-imgSrc"
    ) as HTMLImageElement;
    if (imgSrcRef) {
      const constrainByHeight = imgSrcRef.height <= imgSrcRef.width;
      setImgStyle({
        height: constrainByHeight ? height : "auto",
        width: constrainByHeight ? "auto" : height,
        maxHeight: constrainByHeight ? maxHeight : "auto",
        maxWidth: constrainByHeight ? "auto" : maxHeight,
      });
    }
  }, []);

  return (
    <Paper
      elevation={2}
      style={{
        borderRadius: "20%",
        height: height,
        width: height,
        maxHeight: maxHeight,
        maxWidth: maxHeight,
        overflow: "hidden",
        marginRight: theme.spacing(2),
      }}
    >
      <img id="item-card-media-imgSrc" src={media} style={imgStyle} />
    </Paper>
  );
}

export default ItemCardMedia;
