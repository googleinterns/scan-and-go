import React, { useEffect, useState } from "react";
import ItemPlaceholder from "src/components/ItemPlaceholder";

function PlaceholderCart({ length }: { length: number }) {
  const generatePlaceholders = () => {
    const placeholders = [];
    for (let i = 0; i < length; ++i) {
      placeholders.push(<ItemPlaceholder key={`item-${i}`} />);
    }
    return placeholders;
  };

  return <div className="PlaceholderCart">{generatePlaceholders()}</div>;
}

export default PlaceholderCart;
