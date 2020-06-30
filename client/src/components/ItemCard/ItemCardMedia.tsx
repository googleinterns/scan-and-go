import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";

function ItemCardMedia({
  media,
  height,
}: {
  media: string | null | undefined;
  height?: number;
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
      });
    }
  }, []);

  if (media) {
    return (
      <div
        style={{
          borderRadius: "20%",
          height: height,
          width: height,
          overflow: "hidden",
          marginRight: theme.spacing(2),
        }}
      >
        <img id="item-card-media-imgSrc" src={media} style={imgStyle} />
      </div>
    );
  } else {
    return <p>Media Placeholder</p>;
  }
}

export default ItemCardMedia;
