import React, { useEffect, useState } from "react";

function Receipt() {
  // Update URL params to find storeID
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);
  const orderID = urlParams.get("id");

  // Html DOM element returned
  return (
    <div className="Receipt">
      <a href="/">back</a>
      <h1>Order ID: {orderID}</h1>
    </div>
  );
}

export default Receipt;
