import React, { useEffect, useState, useContext } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { Button, Typography } from "@material-ui/core";
import QRCode from "qrcode";
import { HOME_PAGE, PAYMENT_STATUS } from "src/constants";
import { AlertContext } from "src/contexts/AlertContext";
import "src/css/Receipt.css";
declare const window: any;

const Receipt: React.FC<RouteComponentProps> = ({ history }) => {
  const orderId = urlGetParam("id");
  const contents = history.location.state
    ? (history.location.state as any)?.contents
    : null;
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

  return (
    <div className="receipt">
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
