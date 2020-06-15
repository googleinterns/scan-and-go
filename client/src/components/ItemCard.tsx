import React, { useEffect, useState } from "react";
import { CartItem } from "./../interfaces";
import { PRICE_FRACTION_DIGITS } from "../constants";
import { Typography, Paper, Grid, Divider } from "@material-ui/core";

function ItemCard({
  cartItem,
  idx,
  updateItemQuantity,
}: {
  cartItem: CartItem;
  idx: number;
  updateItemQuantity: (idx: number, quantity: number) => void;
}) {
  const increaseCounter = () => {
    updateItemQuantity(idx, cartItem.quantity + 1);
  };

  const decreaseCounter = () => {
    updateItemQuantity(idx, cartItem.quantity - 1);
  };

  return (
    <Paper elevation={0}>
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
          <Typography variant="body1">
            $
            {(cartItem.item.price * cartItem.quantity).toFixed(
              PRICE_FRACTION_DIGITS
            )}
          </Typography>
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
            <button onClick={increaseCounter}>Plus</button>
          </Grid>
          <Grid item xs={12}>
            <p>{cartItem.quantity}</p>
          </Grid>
          <Grid item xs={12}>
            <button onClick={decreaseCounter}>Minus</button>
          </Grid>
        </Grid>
      </Grid>
      <Divider />
    </Paper>
  );
}

export default ItemCard;
