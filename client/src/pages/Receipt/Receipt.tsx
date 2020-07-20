import React, { useEffect, useState, useContext } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { AlertContext } from "src/contexts/AlertContext";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { Button, Typography, Grid } from "@material-ui/core";
import QRCode from "qrcode";
import { HOME_PAGE } from "src/constants";
import "src/css/Receipt.css";
import { CartItem } from "src/interfaces";
import Page from "src/pages/Page";
import Header from "src/components/Header";
import CartSummary from "src/components/CartSummary";
import { getOrderContents } from "../Actions";
declare const window: any;

const Receipt: React.FC = () => {
  const history = useHistory();
  const orderName = urlGetParam("order") || "";
  const [contents, setContents] = useState<CartItem[]>();
  const qrCodeDiv: React.RefObject<HTMLDivElement> = React.createRef();
  const [viewQr, setViewQr] = useState(true);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    getOrderContents(orderName).then((res) => {
      setContents(res);
    });
  }, []);

  useEffect(() => {
    if (contents) {
      generateQR();
    }
  }, [contents]);

  const generateQR = () => {
    const text = `$Order: ${orderName}.\n Contents: ${contents}`;

    // Calculate QR code width to fit within screen (otherwise it defaults to a fixed size),
    // taking into account space needed for text below QR code.
    if (qrCodeDiv.current) {
      const divHeight =
        0.8 *
        parseInt(
          window
            .getComputedStyle(qrCodeDiv.current)!
            .getPropertyValue("height"),
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
          if (err) {
            setAlert("error", `Unable to generate QR code `);
          }
        }
      );
    }
  };

  const returnToHome = () => {
    history.push({
      pathname: HOME_PAGE,
    });
  };

  const changeView = () => {
    setViewQr(!viewQr);
  };

  return (
    <Page
      header={<Header title={<Typography variant="h4">Receipt</Typography>} />}
      content={
        <Grid container item xs>
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
          <Grid
            item
            xs
            className="qrCode"
            onClick={changeView}
            style={{ display: viewQr ? "flex" : "none" }}
            hidden={!viewQr}
            ref={qrCodeDiv}
            id="qrGrid"
          >
            <canvas id="canvas" />
            <Typography align="center" color="textSecondary">
              Please show this to the cashier for verification.
            </Typography>
            <Typography align="center" color="textSecondary">
              Tap to see order details.
            </Typography>
          </Grid>
        </Grid>
      }
      footer={
        <Button
          onClick={returnToHome}
          variant="contained"
          color="primary"
          fullWidth={true}
        >
          Return to home
        </Button>
      }
    />
  );
};

export default withRouter(Receipt);
