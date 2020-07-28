import React, { useEffect, useState, useContext } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { AlertContext } from "src/contexts/AlertContext";
import Cart from "src/components/Cart";
import { urlGetParam, parseOrderName } from "src/utils";
import { Button, Typography, Grid, Collapse } from "@material-ui/core";
import QRCode from "qrcode";
import { TEST_STORE_MERCHANT_ID, SCALING_FACTOR } from "src/constants";
import "src/css/Receipt.css";
import { CartItem } from "src/interfaces";
import Page from "src/pages/Page";
import Header from "src/components/Header";
import CartSummary from "src/components/CartSummary";
import { getOrderDetails, getStoreRedirectUrl } from "../Actions";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
declare const window: any;

const Receipt: React.FC = () => {
  const history = useHistory();
  const orderName = urlGetParam("order") || "";
  const { merchantId, orderId } = parseOrderName(orderName);
  const [contents, setContents] = useState<CartItem[]>([]);
  const [orderTimestamp, setOrderTimestamp] = useState("");
  const [storeId, setStoreId] = useState("");
  const qrCodeDiv: React.RefObject<HTMLDivElement> = React.createRef();
  const orderRef: React.RefObject<HTMLDivElement> = React.createRef();
  const [showOrder, setShowOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    getOrderDetails(orderName).then((res) => {
      setContents(res.contents);
      setOrderTimestamp(res.timestamp);
      setStoreId(res.storeId);
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      generateQR();
    }
  }, [isLoading]);

  const generateQR = () => {
    const text = `$Order: ${orderName}.\n Contents: ${contents}`;

    // Calculate maximum possible QR code width to fit within screen
    // (otherwise it defaults to a fixed size)
    if (qrCodeDiv.current) {
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
          if (err) {
            setAlert("error", `Unable to generate QR code `);
          }
        }
      );
    }
  };

  const enlargeQrCode = () => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.style.height =
        (parseInt(canvas.style.height) * SCALING_FACTOR).toString() + "px";
      canvas.style.width =
        (parseInt(canvas.style.width) * SCALING_FACTOR).toString() + "px";
    }
  };

  const shrinkQrCode = () => {
    const canvas = document.getElementById("canvas");
    if (canvas) {
      canvas.style.height =
        (parseInt(canvas.style.height) / SCALING_FACTOR).toString() + "px";
      canvas.style.width =
        (parseInt(canvas.style.width) / SCALING_FACTOR).toString() + "px";
    }
  };

  const scrollToOrder = () => {
    if (orderRef.current) {
      orderRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const returnToStore = () => {
    // TODO (#20): replace TEST_STORE_MERCHANT_ID with merchantId once we move each merchant to have its own microapp
    history.push(getStoreRedirectUrl(storeId, TEST_STORE_MERCHANT_ID));
  };

  return (
    <Page
      header={
        <Header
          title={<Typography variant="h4">Receipt</Typography>}
          homeBtn={true}
        />
      }
      content={
        <div className="receipt-content">
          <Typography align="left" color="textSecondary">
            No.: {orderId}
          </Typography>
          <Typography align="left" color="textSecondary">
            {orderTimestamp}
          </Typography>
          <div className="qrCode" ref={qrCodeDiv}>
            <canvas id="canvas" />
          </div>
          <div ref={orderRef}>
            <Grid>
              <Button
                onClick={() => setShowOrder(!showOrder)}
                disabled={isLoading}
                fullWidth={true}
                style={{ textTransform: "none" }}
              >
                {showOrder ? (
                  <div>
                    <ExpandLessIcon />
                    <Typography align="center" color="textSecondary">
                      Hide order details.
                    </Typography>
                  </div>
                ) : (
                  <div>
                    <Typography align="center" color="textSecondary">
                      View order details.
                    </Typography>
                    <ExpandMoreIcon />
                  </div>
                )}
              </Button>
            </Grid>
            <Collapse
              timeout={0}
              in={showOrder}
              onEntered={scrollToOrder}
              onEnter={shrinkQrCode}
              onExit={enlargeQrCode}
            >
              <div className="order">
                <div className="details">
                  {contents && (
                    <Cart
                      contents={contents}
                      collapse={true}
                      showMedia={false}
                    />
                  )}
                </div>
                <CartSummary cartItems={contents}></CartSummary>
              </div>
            </Collapse>
          </div>
        </div>
      }
      footer={
        <Button
          className="returnBtn"
          onClick={returnToStore}
          variant="contained"
          color="primary"
          fullWidth={true}
        >
          Shop again
        </Button>
      }
    />
  );
};

export default withRouter(Receipt);
