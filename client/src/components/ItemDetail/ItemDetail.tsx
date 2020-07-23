import React, { useEffect, useState } from "react";
import { CartItem, emptyItem } from "src/interfaces";
import { Button, Typography, Grid, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme } from "@material-ui/core/styles";
import ItemCardQuantityMixer from "src/components/ItemCard/ItemCardQuantityMixer";
import { PRICE_FRACTION_DIGITS, PLACEHOLDER_ITEM_MEDIA } from "src/constants";
import { getSubtotalPrice, parseRawTextNewlines } from "src/utils";

function ItemDetail({
  cartItem,
  closeCallback,
  updateItemQuantity,
}: {
  cartItem: CartItem | undefined;
  closeCallback: () => void;
  updateItemQuantity: (barcode: string, quantity: number) => void;
}) {
  const theme = useTheme();
  const item = cartItem ? cartItem.item : emptyItem();
  const cornerRoundingPercentage = 10;

  const updateItemQuantityWrapper = (quantity: number) => {
    if (item) {
      updateItemQuantity(item.barcode, quantity);
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <IconButton
        id="item-detail-dismiss"
        style={{
          top: `${theme.spacing(2)}px`,
          left: `${theme.spacing(2)}px`,
          position: "fixed",
          color: "#FFFFFF",
          backgroundColor: "rgba(0,0,0,0.3)",
        }}
        onClick={() => closeCallback()}
        size="small"
      >
        <CloseIcon />
      </IconButton>
      <div style={{ width: "100vw", height: "60vh", overflow: "hidden" }}>
        <img
          src={item.media ? item.media : PLACEHOLDER_ITEM_MEDIA}
          style={{ height: "100%", width: "100%", objectFit: "cover" }}
        />
      </div>
      <div style={{ width: "100vw" }}>
        {/*TODO(#198): zIndex layering helper class needed to manage layers on page*/}
        <div
          style={{
            position: "absolute",
            zIndex: 1003,
            width: "100%",
            height: `${cornerRoundingPercentage}vw`,
            marginTop: `-${cornerRoundingPercentage}vw`,
            borderTopLeftRadius: `${cornerRoundingPercentage}vw`,
            borderTopRightRadius: `${cornerRoundingPercentage}vw`,
            backgroundColor: "#FFFFFF",
          }}
        />
        <div
          style={{ width: "100%", height: "40vh", backgroundColor: "#FFFFFF" }}
        >
          <Grid
            container
            direction="column"
            alignItems="stretch"
            style={{ padding: theme.spacing(2), width: "100%", height: "100%" }}
          >
            <Grid item>
              <Typography variant="h4">
                {cartItem ? item.name : "Nothing to see here..."}
              </Typography>
              {item.unit && (
                <Typography variant="body2">{item.unit}</Typography>
              )}
            </Grid>
            <Grid item xs style={{ overflowY: "scroll", overflowX: "hidden" }}>
              {item.detail &&
                parseRawTextNewlines(item.detail).map(
                  (line: string, i: number) => (
                    <Typography
                      key={`detail-${item.barcode}-${i}`}
                      variant="subtitle2"
                    >
                      {line}
                    </Typography>
                  )
                )}
            </Grid>
            <Grid item container direction="row" justify="space-between">
              <Grid item style={{ marginBottom: theme.spacing(2) }}>
                <ItemCardQuantityMixer
                  quantity={cartItem ? cartItem.quantity : 0}
                  updateQuantity={updateItemQuantityWrapper}
                />
              </Grid>
              <Grid item xs>
                <Grid item xs container direction="column">
                  <Grid item>
                    <Typography variant="body1" align="right">
                      ea. ${item.price.toFixed(PRICE_FRACTION_DIGITS)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="body1" align="right">
                      Subtotal: ${cartItem ? getSubtotalPrice(cartItem) : 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ marginBottom: theme.spacing(1) }}>
              <Button variant="contained" fullWidth={true} color="primary">
                Add to Cart
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
