import React, { useEffect, useState } from "react";
import { CartItem, emptyItem } from "src/interfaces";
import { Button, Typography, Grid, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useTheme, MuiThemeProvider } from "@material-ui/core/styles";
import { ErrorTheme } from "src/theme";
import ItemCardQuantityMixer from "src/components/ItemCard/ItemCardQuantityMixer";
import { PRICE_FRACTION_DIGITS, PLACEHOLDER_ITEM_MEDIA } from "src/constants";
import {
  getSubtotalPrice,
  parseRawTextNewlines,
  checkContentOverflow,
} from "src/utils";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

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
  const [isOverflow, setIsOverflow] = useState<boolean>(false);
  const [mediaCollapsed, setMediaCollapsed] = useState<boolean>(false);

  const theme = useTheme();

  const item = cartItem ? cartItem.item : emptyItem();
  const cornerRoundingRadius = "24px";

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
    // Refresh whether we collapse media (image) to show more of text
    setMediaCollapsed(false);
    // Determine whether we should render 'show more' expand button
    const contentDiv = document.getElementById("item-detail-description");
    if (contentDiv) setIsOverflow(checkContentOverflow(contentDiv));
    else setIsOverflow(false); // Cannot find content tag, no content to render
  }, [cartItem]);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <IconButton
        id="item-detail-dismiss"
        style={{
          zIndex: 1004,
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
      <div
        style={{
          width: "100vw",
          height: "60vh",
          overflow: "hidden",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundImage: `url('${
            item.media ? item.media : PLACEHOLDER_ITEM_MEDIA
          }')`,
        }}
      />
      <div style={{ width: "100vw" }}>
        {/*TODO(#198): zIndex layering helper class needed to manage layers on page*/}
        <div
          style={{
            position: "absolute",
            zIndex: 1003,
            width: "100%",
            height: `${cornerRoundingRadius}`,
            marginTop: `-${cornerRoundingRadius}`,
            borderTopLeftRadius: `${cornerRoundingRadius}`,
            borderTopRightRadius: `${cornerRoundingRadius}`,
            backgroundColor: "#FFFFFF",
            textAlign: "center",
          }}
        >
          {/*Floating Expand button*/}
          {isOverflow && (
            <Button
              fullWidth={true}
              style={{ height: `${cornerRoundingRadius}` }}
              onClick={() => setMediaCollapsed(!mediaCollapsed)}
            >
              {mediaCollapsed ? "Show Less" : "Show More"}
              {mediaCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </Button>
          )}
        </div>
        {/*Content Div Container*/}
        <div
          style={{
            transition: "height 0.3s ease-out, margin-top 0.3s ease-out",
            width: "100%",
            marginTop: mediaCollapsed ? "-50vh" : "0vh",
            height: mediaCollapsed ? "90vh" : "40vh",
            backgroundColor: "#FFFFFF",
          }}
        >
          <Grid
            container
            direction="column"
            alignItems="stretch"
            style={{
              paddingLeft: theme.spacing(2),
              paddingRight: theme.spacing(2),
              paddingBottom: theme.spacing(2),
              width: "100%",
              height: "100%",
            }}
          >
            <Grid item>
              <Typography variant="h4">
                {cartItem ? item.name : "Nothing to see here..."}
              </Typography>
              {item.unit && (
                <Typography variant="body2">{item.unit}</Typography>
              )}
            </Grid>
            <Grid
              id="item-detail-description"
              item
              xs
              style={{ overflowY: "hidden", overflowX: "hidden" }}
            >
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
                    id="item-detail-action-btn"
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
                  id="item-detail-action-btn"
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
