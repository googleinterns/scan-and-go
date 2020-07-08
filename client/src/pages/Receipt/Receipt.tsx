import React, { useEffect, useState, useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { Button, Typography, Grid } from "@material-ui/core";
import QRCode from "qrcode";
import { HOME_PAGE, PAYMENT_STATUS } from "src/constants";
import { AlertContext } from "src/contexts/AlertContext";
import "src/css/Receipt.css";
import "src/css/animation.css";
import { CartItem } from "src/interfaces";
declare const window: any;

const Receipt: React.FC<RouteComponentProps> = ({ history }) => {
  const orderId = urlGetParam("id");
  const { contents } = (history.location.state as any) || [];
  const [paymentStatus, setPaymentStatus] = useState<PAYMENT_STATUS>(
    PAYMENT_STATUS.AWAITING
  );
  const { setOpen, setAlertSeverity, setAlertMessage } = useContext(
    AlertContext
  );
  const qrCodeDiv: React.RefObject<HTMLInputElement> = React.createRef();
  const [viewQr, setViewQr] = useState(false);

  useEffect(() => {
    if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
      confirm();
      generateQR();
    }
  }, [paymentStatus]);

  const makePayment = () => {
    verify();
    // TODO (#50): Replace timeout mock with actual payflow
    setTimeout(() => {
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
    }, 3000);
  };

  const verify = () => {
    setViewQr(true);
    setPaymentStatus(PAYMENT_STATUS.SUBMITTED);
  };

  const confirm = () => {
    setAlertSeverity("success");
    setAlertMessage(`Order ${orderId} Confimed!`);
    setOpen(true);
  };

  const generateQR = () => {
    const text = `$Order ID: ${orderId}`;

    console.log(qrCodeDiv);
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

  const returnToHome = () => {
    history.push({
      pathname: HOME_PAGE,
    });
  };

  const changeView = () => {
    if (paymentStatus === PAYMENT_STATUS.AWAITING) {
      return;
    }
    setViewQr(!viewQr);
  };

  return (
    <div className="receipt">
      <Typography variant="h4">Receipt</Typography>
      {!viewQr && (
        <div className="order">
          <Typography variant="h6">Order details</Typography>
          <ReceiptHeader />
          <div className="details" onClick={changeView}>
            <Cart contents={contents} collapse={true} showMedia={false} />
            {/* TODO: uncomment below after merging #178 */}
            {/* <CartSummary cartItems={contents}></CartSummary> */}
          </div>
        </div>
      )}
      {paymentStatus === PAYMENT_STATUS.SUBMITTED && (
        <div className="payment">
          <Typography variant="h5" align="center" className={"trailing-dots"}>
            Verifying payment, please wait
          </Typography>
        </div>
      )}
      {paymentStatus === PAYMENT_STATUS.SUCCESS && (
        <div
          className="qrCode"
          onClick={changeView}
          style={{ display: viewQr ? "flex" : "none" }}
          hidden={!viewQr}
          ref={qrCodeDiv}
        >
          <canvas id="canvas" />
          <Typography align="center" color="textSecondary">
            Please show this to the cashier for verification.
          </Typography>
          <Typography align="center" color="textSecondary">
            Tap to see order details.
          </Typography>
        </div>
      )}
      <Button
        onClick={
          paymentStatus === PAYMENT_STATUS.AWAITING ? makePayment : returnToHome
        }
        className="button"
        variant="contained"
        color="primary"
      >
        {paymentStatus === PAYMENT_STATUS.AWAITING
          ? "Confirm Checkout"
          : "Return to home"}
      </Button>
    </div>
  );
};

const ReceiptHeader = () => (
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
);

export default withRouter(Receipt);
