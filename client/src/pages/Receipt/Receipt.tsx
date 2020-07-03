import React, { useEffect, useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { CartItem } from "src/interfaces";
import { Button, Typography } from "@material-ui/core";
import QRCode from "qrcode";
import { toast, Zoom, Flip } from "react-toastify";
import StyledToastContainer from "./StyledToastContainer";
import { HOME_PAGE } from "src/constants";
import "src/css/Receipt.css";
import "react-toastify/dist/ReactToastify.css";
declare const window: any;

const Receipt: React.FC<RouteComponentProps> = ({ history }) => {
  const orderId = urlGetParam("id");
  const contents = history.location.state
    ? (history.location.state as any)?.contents
    : null;

  const toastId = 0;
  const qrCodeDiv: React.RefObject<HTMLInputElement> = React.createRef();

  useEffect(() => {
    verify();
    // TODO (#50): Call confirm() upon payflow success
    setTimeout(() => {
      confirm();
    }, 3000);
    generateQR();
  }, []);

  const returnToHome = () => {
    history.push({
      pathname: HOME_PAGE,
    });
  };

  const verify = () => {
    toast("Verifying payment, please wait...", {
      toastId: toastId,
      position: toast.POSITION.TOP_CENTER,
      type: toast.TYPE.INFO,
      autoClose: 5000,
      hideProgressBar: false,
    });
  };

  const confirm = () => {
    toast.update(toastId, {
      render: `Order ${orderId} Confimed!`,
      type: toast.TYPE.SUCCESS,
      autoClose: 3000,
      hideProgressBar: true,
      transition: Flip,
    });
  };

  const generateQR = () => {
    const text = `$Order ID: ${orderId}`;
    const width = parseInt(
      window.getComputedStyle(qrCodeDiv.current)!.getPropertyValue("height"),
      10
    );
    QRCode.toCanvas(
      document.getElementById("canvas"),
      text,
      { width: width },
      (err) => {
        if (err) console.error(err);
      }
    );
  };

  return (
    <div className="receipt">
      <StyledToastContainer
        autoClose={5000}
        pauseOnFocusLoss={false}
        transition={Zoom}
      />
      <Typography variant="h4">Receipt</Typography>
      <div className="qrCode" ref={qrCodeDiv}>
        <canvas id="canvas" />
      </div>
      <div className="contents">
        <Typography variant="h6">Order details</Typography>
        {contents && <Cart contents={contents} collapse={true} />}
      </div>
      <Button
        onClick={returnToHome}
        className="button"
        variant="contained"
        color="primary"
      >
        Confirm Checkout
      </Button>
    </div>
  );
};

export default withRouter(Receipt);
