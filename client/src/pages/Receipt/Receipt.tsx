import React, { useEffect, useState, useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { Button, Typography, Grid } from "@material-ui/core";
import QRCode from "qrcode";
import { HOME_PAGE, PAYMENT_STATUS } from "src/constants";
import { AlertContext } from "src/contexts/AlertContext";
import "src/css/Receipt.css";
import { CartItem } from "src/interfaces";
declare const window: any;

const Receipt: React.FC<RouteComponentProps> = ({ history }) => {
  const orderId = urlGetParam("id");
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
  const contents = [milk];
  // const contents = [milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk, cheese, milk];
  const [paymentStatus, setPaymentStatus] = useState<PAYMENT_STATUS>(
    PAYMENT_STATUS.SUBMITTED
  );
  const { setOpen, setAlertSeverity, setAlertMessage } = useContext(
    AlertContext
  );
  const qrCodeDiv: React.RefObject<HTMLInputElement> = React.createRef();

  const verify = () => {
    setAlertSeverity("info");
    setAlertMessage(`Verifying payment, please wait...`);
    setOpen(true);
  };

  const confirm = () => {
    setAlertSeverity("success");
    setAlertMessage(`Order ${orderId} Confimed!`);
  };

  const generateQR = () => {
    const text = `$Order ID: ${orderId}`;

    const divHeight = parseInt(
      window.getComputedStyle(qrCodeDiv.current)!.getPropertyValue("height"),
      10
    );
    const divWidth = parseInt(
      window.getComputedStyle(qrCodeDiv.current)!.getPropertyValue("width"),
      10
    );
    const width = Math.min(divHeight, divWidth);
    QRCode.toCanvas(
      document.getElementById("canvas"),
      text,
      { width: width },
      (err) => {
        if (err) console.error(err);
      }
    );
  };

  useEffect(() => {
    verify();
    // TODO (#50): Replace timeout mock with actual payflow
    setTimeout(() => {
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
    }, 3000);
    generateQR();
  }, []);

  useEffect(() => {
    if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
      confirm();
    }
  }, [paymentStatus]);

  const returnToHome = () => {
    history.push({
      pathname: HOME_PAGE,
    });
  };

  const [viewQr, setViewQr] = useState(false);
  const changeView = () => {
    setViewQr(!viewQr);
  };

  return (
    <div className="receipt">
      <Typography variant="h4">Receipt</Typography>
      <div
        className="qrCode"
        onClick={changeView}
        style={{ display: viewQr ? "flex" : "none" }}
        hidden={!viewQr}
        ref={qrCodeDiv}
      >
        <canvas id="canvas" />
        <Typography>
          Please show this to the cashier for verification.
        </Typography>
        <Typography>Tap to see order details.</Typography>
      </div>
      {/* {!viewQr && } */}
      {!viewQr && (
        <div className="order" hidden={viewQr}>
          <Typography variant="h6">Order details</Typography>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            style={{ borderBottom: "2px solid" }}
          >
            <Grid item xs={3}>
              <Typography variant="body1">Item</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Price</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1">Subtotal</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography variant="body1" align="center">
                Quantity
              </Typography>
            </Grid>
          </Grid>
          <div className="details" onClick={changeView}>
            {contents && (
              <Cart contents={contents} collapse={true} showMedia={false} />
            )}
          </div>
        </div>
      )}
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
