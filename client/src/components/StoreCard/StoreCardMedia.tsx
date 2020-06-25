import React from "react";

function StoreCardMedia({
  media,
  height,
}: {
  media: string | null | undefined;
  height?: number;
}) {
  if (media) {
    return <img src={media} height={height} />;
  } else {
    return <p>Media Placeholder</p>;
  }
}

export default StoreCardMedia;
