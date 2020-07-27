import React, { useEffect, useState } from "react";
import { CartItem, emptyItem } from "src/interfaces";
import { Button, Typography, Grid, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ErrorTheme } from "src/theme";
import ItemCardQuantityMixer from "src/components/ItemCard/ItemCardQuantityMixer";
import { PRICE_FRACTION_DIGITS, PLACEHOLDER_ITEM_MEDIA } from "src/constants";
import { getSubtotalPrice, parseRawTextNewlines } from "src/utils";

function ItemDetail({
  cartItem,
  closeCallback,
  updateItemCallback,
  currentCart,
}: {
  cartItem: CartItem | undefined;
  closeCallback: () => void;
  updateItemCallback: (cartItem: CartItem) => void;
  currentCart?: CartItem[];
}) {
  const [curAmount, setCurAmount] = useState<number>(0);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);

  const theme = useTheme();

  const item = cartItem ? cartItem.item : emptyItem();
  const cornerRoundingPercentage = 10;

  // Determine if is new item
  const isNewItem =
    currentCart &&
    !currentCart
      .map((curItem: CartItem) => curItem.item.barcode)
      .includes(item.barcode);

  // Callback for +/- mixer to update chosen item quantity
  const updateItemQuantityWrapper = (quantity: number) => {
    if (item) {
      if (quantity <= 0) {
        setIsRemoving(true);
        setCurAmount(0);
        return;
      }
      setIsRemoving(false);
      setCurAmount(quantity);
    }
  };

  const confirmUpdate = () => {
    const newItem: CartItem = {
      item: item,
      quantity: curAmount,
    };
    updateItemCallback(newItem);
  };

  useEffect(() => {
    if (cartItem) {
      setCurAmount(cartItem.quantity);
    } else {
      setCurAmount(0);
    }
    // Everytime we change to a 'new' item, refresh removal state flag
    setIsRemoving(false);
  }, [cartItem]);

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
                  quantity={curAmount ? curAmount : 0}
                  updateQuantity={updateItemQuantityWrapper}
                  disabled={!cartItem}
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
                      Subtotal: $
                      {cartItem
                        ? getSubtotalPrice({ item: item, quantity: curAmount })
                        : 0}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item style={{ marginBottom: theme.spacing(1) }}>
              {isRemoving ? (
                <MuiThemeProvider theme={ErrorTheme}>
                  <Button
                    disabled={!cartItem}
                    variant="contained"
                    fullWidth={true}
                    color="secondary"
                    onClick={confirmUpdate}
                  >
                    Remove Item
                  </Button>
                </MuiThemeProvider>
              ) : (
                <Button
                  disabled={!cartItem}
                  variant="contained"
                  fullWidth={true}
                  color="primary"
                  onClick={confirmUpdate}
                >
                  {isNewItem ? "Add Item" : "Confirm Change"}
                </Button>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;
