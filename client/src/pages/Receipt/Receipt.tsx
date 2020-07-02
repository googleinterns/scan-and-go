import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { Button, Typography } from "@material-ui/core";
import QRCode from "qrcode";
import "src/css/Receipt.css";
declare const window: any;


function Receipt(props: any) {
  // Update URL params to find storeID
  const orderID = urlGetParam("id");
  const contents = props.location.state ? props.location.state.contents : null;

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = () => {
    const text = JSON.stringify(orderID);
    const width = parseInt(window.getComputedStyle(document.getElementById("canvas"))!.getPropertyValue("width"), 10);
    console.log(width)
    QRCode.toCanvas(
      document.getElementById('canvas'), 
      text, 
      { width: width }, 
      (err) => {
        if (err) console.error(err);
    })
  };

  return (
    <div className="receipt">
      <a href="/home">back</a>
      <p>Order {orderID} Confimed!</p>
      <Typography variant="h4">Receipt</Typography>
      <div className="content">
        <canvas id="canvas"/>
        {contents && <Cart contents={contents} collapse={true} />}
      </div>
      <Button
        fullWidth={true}
        variant="contained"
        color="primary"
        style={{ fontSize: "14px", borderRadius: 14 }}
      >
        Confirm Checkout
      </Button>
    </div>    
  );
}

export default withRouter(Receipt);
