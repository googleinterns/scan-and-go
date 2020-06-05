import React, { useEffect, useState } from "react";
import Cart from "./../components/Cart";
import { CartItem } from "./../interfaces";

function Receipt() {
  // Update URL params to find storeID
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);
  const urlString = urlParams.get("contents");
  let contents: CartItem[] = [];
  if (urlString != null) {
    let contentsString = decodeURIComponent(urlString);
    if (contentsString != null) {
      contents = JSON.parse(contentsString);
    }
  }

  // Html DOM element returned
  return (
    <div className="Receipt">
      <a href="/">back</a>
      <h1>Receipt:</h1>
      <Cart contents={contents} />
    </div>
  );
}

export default Receipt;
