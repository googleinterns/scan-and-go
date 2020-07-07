import React, { useEffect, useState } from "react";
import StorePlaceholder from "src/components/StorePlaceholder";

function PlaceholderStoreList({ length }: { length: number }) {
  const generatePlaceholders = () => {
    const placeholders = [];
    for (let i = 0; i < length; ++i) {
      placeholders.push(<StorePlaceholder key={`store-${i}`} />);
    }
    return placeholders;
  };

  return <div className="PlaceholderStoreList">{generatePlaceholders()}</div>;
}

export default PlaceholderStoreList;
