import React, { useEffect, useState } from "react";
import Cart from "src/components/Cart";
import { CartItem } from "src/interfaces";
declare const window: any;

function Receipt() {
  // Update URL params to find storeID
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);
  const urlRawContents = urlParams.get("contents");
  const orderID = urlParams.get("id");
  let contents: CartItem[] = [];
  if (urlRawContents != null) {
    let contentsString = decodeURIComponent(urlRawContents);
    if (contentsString != null) {
      contents = JSON.parse(contentsString);
    }
  }

  return (
    <div className="Receipt">
      <a href="/home">back</a>
      <p>Order [{orderID}] Confimed!</p>
      <h3>Receipt:</h3>
      <Cart contents={contents} />
    </div>
  );
}

export default Receipt;
