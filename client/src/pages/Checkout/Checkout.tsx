import React, { useEffect, useState, useContext } from "react";
import { withRouter, RouteComponentProps, useHistory } from "react-router-dom";
import Cart from "src/components/Cart";
import { urlGetParam } from "src/utils";
import { Button, Typography, Grid } from "@material-ui/core";
import QRCode from "qrcode";
import { HOME_PAGE, PAYMENT_STATUS, RECEIPT_PAGE } from "src/constants";
import { AlertContext } from "src/contexts/AlertContext";
import "src/css/Receipt.css";
import "src/css/animation.css";
import { CartItem, Store } from "src/interfaces";
import Page from "src/pages/Page";
import Header from "src/components/Header";
import CartSummary from "src/components/CartSummary";
import { createOrder } from "../Actions";
declare const window: any;

const Checkout: React.FC = () => {
  const history = useHistory();
  const { store, contents }: { store: Store; contents: CartItem[] } =
    (history.location?.state as any) || [];
  const [paymentStatus, setPaymentStatus] = useState<PAYMENT_STATUS>(
    PAYMENT_STATUS.AWAITING
  );
  const { setAlert } = useContext(AlertContext);

  useEffect(() => {
    if (paymentStatus === PAYMENT_STATUS.SUCCESS) {
      confirm();
    }
  }, [paymentStatus]);

  const confirm = async () => {
    const orderRes = await createOrder(store, contents);
    if (orderRes) {
      goToReceipt(orderRes.name);
      setAlert("success", `Order ${orderRes.orderId} Confirmed!`);
    }
  };

  const goToReceipt = (orderName: string) => {
    history.push({
      pathname: RECEIPT_PAGE,
      search: `?order=${orderName}`,
    });
  };

  const makePayment = () => {
    verify();
    // TODO (#50): Replace timeout mock with actual payflow
    setTimeout(() => {
      setPaymentStatus(PAYMENT_STATUS.SUCCESS);
    }, 1000);
  };

  const verify = () => {
    setPaymentStatus(PAYMENT_STATUS.SUBMITTED);
  };

  return (
    <Page
      header={
        <Header title={<Typography variant="h4">Order Summary</Typography>} />
      }
      content={
        <Grid container item xs>
          {paymentStatus === PAYMENT_STATUS.AWAITING && (
            <Grid item xs className="order">
              <Typography variant="h6">Order details</Typography>
              <div className="details">
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
        </Grid>
      }
      footer={
        <Button
          onClick={makePayment}
          variant="contained"
          color="primary"
          fullWidth={true}
        >
          Confirm Checkout
        </Button>
      }
    />
  );
};

export default withRouter(Checkout);
