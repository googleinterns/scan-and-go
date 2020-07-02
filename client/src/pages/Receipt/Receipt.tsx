import React, { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { CartItem } from "src/interfaces";
import { Button, Typography } from "@material-ui/core";
import QRCode from "qrcode";
import "src/css/Receipt.css";
import { ToastContainer, toast, Zoom, Flip, cssTransition } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
declare const window: any;

const Receipt: React.FC<RouteComponentProps> = ({history}) => {
  // TODO: remove test variables
  const testorderId = "TEST ORDER";
  const cheese: CartItem = {
    item: {
      name: "cheese",
      price: 3.2,
      "merchant-id": "WPANCUD",
      barcode: "93245036",
    },
    quantity: 2,
  };
  const milk: CartItem = {
    item: {
      name: "milk",
      price: 5.6,
      "merchant-id": "WPANCUD",
      barcode: "93202411",
    },
    quantity: 1,
  };
  const testContents = [cheese, milk];
  const orderId = testorderId;
  const contents = testContents;
  
  // Update URL params to find storeID
  // const orderId = urlGetParam("id");
  // const contents = history.location.state ? history.location.state.contents : null;
  
  const toastId = 0;

  const verify = () => {
    toast(
      "Verifying payment, please wait...", { 
        toastId: toastId,
        position: toast.POSITION.TOP_CENTER,
        type: toast.TYPE.INFO, 
        autoClose: 5000, 
        hideProgressBar: false,
      }
    )
  };

  const confirm = () => {
    toast.update(toastId, { 
      render: `Order ${orderId} Confimed!`,
      type: toast.TYPE.SUCCESS, 
      autoClose: 3000,
      hideProgressBar: true, 
      transition: cssTransition({
        enter: 'zoomIn',
        exit: 'zoomOut',
      })
    });  
  };

  useEffect(() => {
    verify();
    setTimeout(() => confirm(), 3000);
    generateQR();
  }, []);

  const generateQR = () => {
    const text = JSON.stringify(orderId);
    const width = parseInt(window.getComputedStyle(document.getElementById("canvas"))!.getPropertyValue("width"), 10);
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
      <Typography variant="h4">Receipt</Typography>
      <div className="content">
        <canvas id="canvas"/>
      </div>
      {contents && <Cart contents={contents} collapse={true} />}
      <Button
        onClick={verify}
        fullWidth={true}
        variant="contained"
        color="primary"
        style={{ fontSize: "14px", borderRadius: 14 }}
      >
        Confirm Checkout
      </Button>
      <ToastContainer className="toastContainer" autoClose={5000} pauseOnFocusLoss={false} transition={Zoom}/>
    </div>    
  );
}

export default withRouter(Receipt);
