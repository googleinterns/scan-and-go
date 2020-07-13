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
import Page from "src/pages/Page";
import Header from "src/components/Header";
import CartSummary from "src/components/CartSummary";
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

    // Calculate QR code width to fit within screen (otherwise it defaults to a fixed size),
    // taking into account space needed for text below QR code.
    const divHeight =
      0.8 *
      parseInt(
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
    <Page
      header={
        <Header
          title={
            <Typography variant="h4">
              {paymentStatus === PAYMENT_STATUS.SUCCESS
                ? "Receipt"
                : "Order Summary"}
            </Typography>
          }
        />
      }
      content={
        <Grid container item xs className="receipt-content">
          {!viewQr && (
            <Grid item xs className="order">
              <Typography variant="h6">Order details</Typography>
              <div className="details" onClick={changeView}>
                {contents && (
                  <Cart contents={contents} collapse={true} showMedia={false} />
                )}
              </div>
              <CartSummary cartItems={contents}></CartSummary>
            </Grid>
          )}
          {paymentStatus === PAYMENT_STATUS.SUBMITTED && (
            <Grid item xs className="payment">
              <Typography
                variant="h5"
                align="center"
                className={"trailing-dots"}
              >
                Verifying payment, please wait
              </Typography>
            </Grid>
          )}
          {paymentStatus === PAYMENT_STATUS.SUCCESS && (
            <Grid
              item
              xs
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
            </Grid>
          )}
        </Grid>
      }
      footer={
        <Button
          onClick={
            paymentStatus === PAYMENT_STATUS.AWAITING
              ? makePayment
              : returnToHome
          }
          className="button"
          variant="contained"
          color="primary"
          fullWidth={true}
        >
          {paymentStatus === PAYMENT_STATUS.AWAITING
            ? "Confirm Receipt"
            : "Return to home"}
        </Button>
      }
    />
  );
};

export default withRouter(Receipt);
