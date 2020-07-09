import React, { useEffect, useState } from "react";
import { CartItem } from "src/interfaces";
import { Typography, Grid } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { PRICE_FRACTION_DIGITS } from "src/constants";
import {
  GST_PERCENTAGE,
  priceSumArray,
  priceGetGST,
  priceSum,
  priceMul,
} from "src/priceLibrary";

function CartSummary({
  cartItems,
  setTotalCallback,
}: {
  cartItems: CartItem[];
  setTotalCallback?: (total: number) => void;
}) {
  const cartSubtotal = priceSumArray(
    cartItems.map((cartItem) =>
      priceMul(cartItem.item.price, cartItem.quantity)
    )
  );
  const cartGST = priceGetGST(cartSubtotal);
  const cartTotal = priceSum(cartSubtotal, cartGST);

  const theme = useTheme();

  useEffect(() => {
    if (setTotalCallback) setTotalCallback(cartTotal);
  }, [cartItems]);

  return (
    <div className="CartSummary">
      <Grid container direction="row" justify="flex-end">
        <Grid item style={{ marginRight: theme.spacing(4) }}>
          <Typography variant="subtitle1" align="right">
            Subtotal:
          </Typography>
          <Typography variant="subtitle1" align="right">
            GST ({GST_PERCENTAGE}%):
          </Typography>
          <Typography variant="subtitle1" align="right">
            Total:
          </Typography>
        </Grid>
        <Grid item>
          <Typography
            id="cart-summary-subtotal"
            variant="subtitle1"
            align="right"
          >
            ${cartSubtotal.toFixed(PRICE_FRACTION_DIGITS)}
          </Typography>
          <Typography id="cart-summary-gst" variant="subtitle1" align="right">
            ${cartGST.toFixed(PRICE_FRACTION_DIGITS)}
          </Typography>
          <Typography id="cart-summary-total" variant="subtitle1" align="right">
            ${cartTotal.toFixed(PRICE_FRACTION_DIGITS)}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default CartSummary;
