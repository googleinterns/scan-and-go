import React, { useEffect, useState } from "react";
import { CartItem } from "src/interfaces";
import { PRICE_FRACTION_DIGITS } from "src/constants";
import { Fab, Typography, Paper, Grid, Divider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme } from "@material-ui/core/styles";
import { getSubtotalPrice } from "src/utils";
import ItemCardMedia from "./ItemCardMedia";
import ItemCardQuantityMixer from "./ItemCardQuantityMixer";

const ITEM_CARD_MAX_HEIGHT = 120;

function ItemCard({
  cartItem,
  updateItemQuantity,
}: {
  cartItem: CartItem;
  updateItemQuantity: (barcode: string, quantity: number) => void;
}) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  const updateItemQuantityWrapper = (quantity: number) => {
    updateItemQuantity(cartItem.item.barcode, quantity);
  };

  return (
    <Paper
      elevation={0}
      style={{
        marginTop: themeSpacing,
        padding: themeSpacing,
      }}
    >
      <Grid container>
        <Grid item>
          <ItemCardMedia
            height={ITEM_CARD_MAX_HEIGHT}
            media={cartItem.item.media}
          />
        </Grid>
        <Grid item xs container direction="row">
          <Grid item xs container direction="column">
            <Grid item xs>
              <Typography variant="body1">{cartItem.item.name}</Typography>
            </Grid>
            <Grid item xs style={{ minHeight: 50, overflow: "scroll" }}>
              <Typography variant="subtitle2">
                ITEM DESCRIPTION
                <br />
                that is very
                <br />
                very
                <br />
                long
                <br />
              </Typography>
            </Grid>
            <Grid item xs>
              <ItemCardQuantityMixer
                quantity={cartItem.quantity}
                updateQuantity={updateItemQuantityWrapper}
              />
            </Grid>
          </Grid>
          <Grid item>
            <Grid
              item
              container
              direction="column"
              justify="space-between"
              align-items="stretch"
            >
              <Grid item>
                <Typography variant="body1" align="right">
                  ea. ${cartItem.item.price.toFixed(PRICE_FRACTION_DIGITS)}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" align="right">
                  Subtotal: ${getSubtotalPrice(cartItem)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default ItemCard;
