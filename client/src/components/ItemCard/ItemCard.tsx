import React, { useEffect, useState } from "react";
import { CartItem } from "src/interfaces";
import { PRICE_FRACTION_DIGITS } from "src/constants";
import { Typography, Card, Grid, Divider } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { getSubtotalPrice } from "src/utils";

function ItemCard({
  cartItem,
  updateItemQuantity,
}: {
  cartItem: CartItem;
  updateItemQuantity: (barcode: string, quantity: number) => void;
}) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  const increaseCounter = () => {
    updateItemQuantity(cartItem.item.barcode, cartItem.quantity + 1);
  };

  const decreaseCounter = () => {
    updateItemQuantity(cartItem.item.barcode, cartItem.quantity - 1);
  };

  return (
    <Card
      style={{
        marginTop: themeSpacing,
        padding: themeSpacing,
      }}
    >
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={3}>
          <p>Media</p>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body1">{cartItem.item.name}</Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1">
            ${cartItem.item.price.toFixed(PRICE_FRACTION_DIGITS)}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography variant="body1">${getSubtotalPrice(cartItem)}</Typography>
        </Grid>
        <Grid
          container
          item
          xs={2}
          spacing={0}
          direction="column"
          alignItems="center"
        >
          <Grid item xs={12}>
            <button id="inc" onClick={increaseCounter}>
              Plus
            </button>
          </Grid>
          <Grid item xs={12}>
            <p>{cartItem.quantity}</p>
          </Grid>
          <Grid item xs={12}>
            <button id="dec" onClick={decreaseCounter}>
              Minus
            </button>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ItemCard;
