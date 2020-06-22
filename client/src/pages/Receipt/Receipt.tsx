import React, { useEffect, useState } from "react";
import Cart from "src/components/Cart";
import { CartItem } from "src/interfaces";
import { urlGetParam } from "src/utils";
declare const window: any;

function Receipt() {
  // Update URL params to find storeID
  const urlRawContents = urlGetParam("contents");
  const orderID = urlGetParam("id");
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
