import React, { useEffect, useState } from "react";
import { CartItem } from "src/interfaces";
import { PRICE_FRACTION_DIGITS, PLACEHOLDER_ITEM_MEDIA } from "src/constants";
import { Fab, Typography, Paper, Grid, Divider } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import { useTheme } from "@material-ui/core/styles";
import { getSubtotalPrice, parseRawTextNewlines } from "src/utils";
import ItemCardQuantityMixer from "./ItemCardQuantityMixer";
import MediaInfoCard from "src/components/MediaInfoCard";

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
    <MediaInfoCard
      media={cartItem.item.media ? cartItem.item.media : PLACEHOLDER_ITEM_MEDIA}
      mediaVariant="rounded"
      title={<Typography variant="body1">{cartItem.item.name}</Typography>}
      content={
        <div>
          {cartItem.item.detail &&
            parseRawTextNewlines(cartItem.item.detail).map(
              (line: string, i: number) => (
                <Typography
                  key={`detail-${cartItem.item.barcode}-${i}`}
                  variant="subtitle2"
                >
                  {line}
                </Typography>
              )
            )}
        </div>
      }
      rightColumn={
        <Grid item container style={{ height: "100%" }} direction="column">
          <Grid item xs container direction="column">
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
