import React, { useEffect, useState } from "react";
import { CartItem } from "src/interfaces";
import { PRICE_FRACTION_DIGITS } from "src/constants";
import { getSubtotalPrice } from "src/utils";
import { Typography, Card, Grid, Divider } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";

function ItemCard({ cartItem }: { cartItem: CartItem }) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  return (
    <Card
      style={{
        marginTop: themeSpacing,
      }}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
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
        <Grid item xs={2}>
          <Typography variant="body1" align="center">
            {cartItem.quantity}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ItemCard;
