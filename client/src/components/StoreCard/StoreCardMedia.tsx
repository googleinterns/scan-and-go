import React from "react";

function StoreCardMedia({
  media,
  height,
}: {
  media: string | null | undefined;
  height?: number;
}) {
  if (media) {
    return (
      <img
        src={media}
        style={{ borderRadius: "50%", height: height, width: height }}
      />
    );
  } else {
    return <p>Media Placeholder</p>;
  }
}

export default StoreCardMedia;
