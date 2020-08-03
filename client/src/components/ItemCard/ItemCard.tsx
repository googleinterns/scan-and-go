import React, { useEffect, useState } from "react";
import { CartItem } from "src/interfaces";
import { PRICE_FRACTION_DIGITS, PLACEHOLDER_ITEM_MEDIA } from "src/constants";
import { Fab, Typography, Paper, Grid, Divider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme } from "@material-ui/core/styles";
import { getSubtotalPrice, clampTextLines } from "src/utils";
import ItemCardQuantityMixer from "./ItemCardQuantityMixer";
import MediaInfoCard from "src/components/MediaInfoCard";

function ItemCard({
  cartItem,
  updateItemQuantity,
  selectActionCallback,
}: {
  cartItem: CartItem;
  updateItemQuantity: (barcode: string, quantity: number) => void;
  selectActionCallback?: () => void;
}) {
  const theme = useTheme();
  const themeSpacing = theme.spacing(1);

  const updateItemQuantityWrapper = (quantity: number) => {
    updateItemQuantity(cartItem.item.barcode, quantity);
  };

  return (
    <MediaInfoCard
      media={cartItem.item.media ? cartItem.item.media : PLACEHOLDER_ITEM_MEDIA}
      mediaVariant="rounded"
      mediaCallback={selectActionCallback}
      title={
        <Typography variant="h6" style={clampTextLines(2)}>
          {cartItem.item.name}
        </Typography>
      }
      content={
        <Typography variant="body2" color="secondary">
          {cartItem.item.unit}
        </Typography>
      }
      rightColumn={
        <Grid item container style={{ height: "100%" }} direction="column">
          <Grid item xs container direction="column">
            <Grid item>
              <Typography variant="body2" align="right">
                ea. ${cartItem.item.price.toFixed(PRICE_FRACTION_DIGITS)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="subtitle2" align="right">
                Subtotal: ${getSubtotalPrice(cartItem)}
              </Typography>
            </Grid>
          </Grid>
          <Grid item>
            <ItemCardQuantityMixer
              quantity={cartItem.quantity}
              updateQuantity={updateItemQuantityWrapper}
            />
          </Grid>
        </Grid>
      }
    />
  );
}

export default ItemCard;
