import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import StoreHeader from "src/components/StoreHeader";
import ItemCard from "src/components/ItemCard";
import Cart from "src/components/Cart";
import CartHeader from "src/components/CartHeader";
import TextInputField from "src/components/TextInputField";
import PlaceholderCart from "src/components/PlaceholderCart";
import CartSummary from "src/components/CartSummary";
import Page from "src/pages/Page";
import ItemDetail from "src/components/ItemDetail";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  FormGroup,
  FormControlLabel,
  Switch,
  Fab,
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  Button,
  Collapse,
  Slide,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@material-ui/core";
import { MuiThemeProvider, useTheme } from "@material-ui/core/styles";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import EditIcon from "@material-ui/icons/Edit";
import PaymentIcon from "@material-ui/icons/Payment";
import AddIcon from "@material-ui/icons/Add";
import {
  Item,
  CartItem,
  Store,
  emptyStore,
  MediaResponse,
  emptyMediaResponse,
} from "src/interfaces";
import { urlGetParam } from "src/utils";
import {
  getStoreInfo,
  getItem,
  createOrder,
  setCart,
  getCart,
} from "src/pages/Actions";
import {
  BARCODE_PLACEHOLDER,
  PRICE_FRACTION_DIGITS,
  RECEIPT_PAGE,
  PAYMENT_STATUS,
} from "src/constants";
import { microapps, isWeb, isDebug } from "src/config";
import { ErrorTheme } from "src/theme";
import { AlertContext } from "src/contexts/AlertContext";
declare const window: any;

// Flag to toggle display of taken image (for debugging)
const debugImg = true;

function ScanStore() {
  const storeID = urlGetParam("id") || "";
  const merchantID = urlGetParam("mid") || "";

  const theme = useTheme();
  const history = useHistory();

  const [curStore, setCurStore] = useState<Store>(emptyStore());
  const [curItem, setCurItem] = useState<CartItem>();
  const [cartItems, setCartItems] = useState<CartItem[]>(
    getCart(merchantID, storeID)
  );
  const updateCart = (newCartItems: CartItem[]) => {
    setCartItems(newCartItems);
    setCart(newCartItems, merchantID, storeID);
  };
  const [cartTotal, setCartTotal] = useState<number>(0.0);
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  const [showCompactCart, setShowCompactCart] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState<boolean>(
    false
  );
  const [addDirect, setAddDirect] = useState<boolean>(false);
  const [removeBarcode, setRemoveBarcode] = useState<string>("");
  const [debugBarcode, setDebugBarcode] = useState<string>("");
  const { setAlert } = useContext(AlertContext);

  // Entry point for user scanning barcode
  const scanItemToCart = async (barcode: string) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.item.barcode === barcode
    );
    if (existingItem) {
      updateItemQuantity(barcode, existingItem.quantity + 1);
    } else {
      updateNewItem(barcode);
    }
  };

  const updateNewItem = async (barcode: string) => {
    setLoadingItem(true);
    const item: Item = await getItem(barcode, merchantID);
    if (!item.barcode) {
      // TODO (#59): Notify user if barcode is invalid or item not found
      return;
    }
    const newCartItem = {
      item: item,
      quantity: 1,
    };
    setLoadingItem(false);
    // Experimental Flag: Toggle whether we raise dialog for adding item
    //                    or simply chuck it in immediately
    if (addDirect) {
      addCartItem(newCartItem);
    } else {
      // Raise confirmation dialog via Item Details Page
      setCurItem(newCartItem);
      setShowDetail(true);
    }
  };

  // Callback from Item Details Dialog with CartItem in question
  const itemDetailCallback = (cartItem: CartItem) => {
    if (!cartItem || !cartItem.item.barcode) {
      // No item to process
      setShowDetail(false);
      return;
    }
    const barcode = cartItem.item.barcode;
    const quantity = cartItem.quantity;
    const existingItem = cartItems.find(
      (cartItem) => cartItem.item.barcode === barcode
    );
    if (existingItem) {
      if (quantity <= 0) {
        // Removing item
        // We do not need re-confirmation here as user has already
        // explicitly clicked onto a "Remove Item" button in ItemDetail Dialog
        setCurItem(Object.assign({}, curItem, { quantity: quantity }));
        removeCartItem(barcode);
      } else {
        // Change quantity
        setCurItem(Object.assign({}, curItem, { quantity: quantity }));
        updateCartItem(barcode, quantity);
      }
    } else {
      // Call add new item to flow
      addCartItem(cartItem);
    }
    // Close dialog
    setShowDetail(false);
  };

  // Callback for changing item quantities in Cart
  const updateItemQuantity = (barcode: string, quantity: number) => {
    if (quantity <= 0) {
      //TODO(#200): Block user from removing item with confirmation dialog
      // Raise removal confirmation dialog
      raiseRemoveConfirmation(barcode);
      if (curItem && curItem.item.barcode === barcode) {
        setShowDetail(false);
      }
    } else {
      if (curItem && curItem.item.barcode === barcode) {
        setCurItem(Object.assign({}, curItem, { quantity: quantity }));
      }
      updateCartItem(barcode, quantity);
    }
  };

  const dismissRemoveConfirmation = () => {
    setRemoveBarcode("");
    setShowRemoveConfirmation(false);
  };

  const raiseRemoveConfirmation = (barcode: string) => {
    setRemoveBarcode(barcode);
    setShowRemoveConfirmation(true);
  };

  // Callback for user confirmation of item removal from Cart
  const confirmDeleteCallback = (barcode: string) => {
    removeCartItem(barcode);
  };

  /* cartItems: CartItem[] mutation functions */
  // Update item in Cart
  const updateCartItem = (barcode: string, quantity: number) => {
    updateCart(
      cartItems.map((cartItem) => {
        if (cartItem.item.barcode === barcode) {
          return Object.assign({}, cartItem, { quantity: quantity });
        }
        return cartItem;
      })
    );
  };

  // Add new item into Cart
  const addCartItem = (newCartItem: CartItem) => {
    updateCart([...cartItems, newCartItem]);
  };

  // Remove item from Cart
  const removeCartItem = (barcode: string) => {
    updateCart(
      cartItems.filter((cartItem) => cartItem.item.barcode !== barcode)
    );
  };

  const toggleCart = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowCompactCart(event.target.checked);
  };

  const toggleDebug = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDebug(event.target.checked);
  };

  const toggleDetail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowDetail(event.target.checked);
  };

  const toggleAddItemMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddDirect(event.target.checked);
  };

  const checkout = async () => {
    const paymentStatus = makePayment();
    if (paymentStatus == PAYMENT_STATUS.FAILURE) {
      setAlert("error", "Payment failed. Please try again.");
      return;
    }
    const order = await createOrder(curStore, cartItems);
    if (order) {
      goToReceipt(order.name);
      setAlert("success", `Order ${order.orderId} Confirmed!`);
    }
  };

  const makePayment = () => {
    // TODO (#50): Replace with actual payflow
    return PAYMENT_STATUS.SUCCESS;
  };

  const goToReceipt = (orderName: string) => {
    history.push({
      pathname: RECEIPT_PAGE,
      search: `?order=${orderName}`,
    });
  };

  // Upon entering page, grab store details
  useEffect(() => {
    if (storeID) {
      getStoreInfo(storeID).then((res) => setCurStore(res));
    }
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <Page
        className="ScanStore"
        header={
          <div className="ScanStore-header">
            <CartHeader
              store={curStore}
              scanBarcodeCallback={scanItemToCart}
              content={
                <FormGroup row>
                  <FormControlLabel
                    control={<Switch onChange={toggleCart} color="primary" />}
                    label="Compact View"
                  />
                  <MuiThemeProvider theme={ErrorTheme}>
                    <FormControlLabel
                      control={
                        <Switch onChange={toggleDebug} color="secondary" />
                      }
                      label="Debug"
                    />
                  </MuiThemeProvider>
                </FormGroup>
              }
            />
            {showDebug && [
              <TextInputField
                text={debugBarcode ? debugBarcode : BARCODE_PLACEHOLDER}
                setState={setDebugBarcode}
              />,
              <button onClick={() => scanItemToCart(debugBarcode)}>
                Test Add Item
              </button>,
              <FormControlLabel
                checked={showDetail}
                control={<Switch onChange={toggleDetail} color="primary" />}
                label="Show Item Detail"
              />,
              <FormControlLabel
                checked={addDirect}
                control={
                  <Switch onChange={toggleAddItemMode} color="primary" />
                }
                label="Add Item Directly"
              />,
            ]}
            <Divider />
          </div>
        }
        content={
          <Grid item container direction="column">
            <Grid item>
              <Cart
                contents={cartItems}
                collapse={showCompactCart}
                updateItemQuantity={updateItemQuantity}
                itemPickerCallback={(item: CartItem) => {
                  setCurItem(item);
                  setShowDetail(true);
                }}
              />
            </Grid>
            {loadingItem && (
              <Grid item>
                <PlaceholderCart length={1} />
              </Grid>
            )}
            {cartItems.length == 0 && !loadingItem && (
              <Grid container item xs direction="column" justify="center">
                <Typography variant="subtitle2" align="center">
                  No items in cart.
                </Typography>
                <Typography variant="subtitle2" align="center">
                  Scan the barcode to shop.
                </Typography>
              </Grid>
            )}
          </Grid>
        }
        footer={
          <div className="ScanStore-footer">
            <Grid item container direction="row" justify="center">
              <div
                onClick={() => setShowFooter(!showFooter)}
                style={{ zIndex: 1000, marginTop: "-36px" }}
              >
                <Button>
                  {showFooter ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                </Button>
              </div>
            </Grid>
            <Collapse in={showFooter}>
              <Grid item>
                <Divider />
                <CartSummary
                  cartItems={cartItems}
                  setTotalCallback={(total: number) => setCartTotal(total)}
                />
              </Grid>
            </Collapse>
            <Grid item>
              <Button
                fullWidth={true}
                variant="contained"
                color="primary"
                onClick={checkout}
                className="checkoutBtn"
              >
                {showFooter
                  ? "Checkout"
                  : `Checkout: $${cartTotal.toFixed(PRICE_FRACTION_DIGITS)}`}
              </Button>
            </Grid>
          </div>
        }
      />
      {/*TODO(#198): zIndex layering helper class needed to manage layers on page*/}
      <Slide
        direction="up"
        in={showDetail}
        onExited={() => setCurItem(undefined)}
      >
        <div
          style={{
            zIndex: 1001,
            bottom: "0px",
            left: "0px",
            position: "fixed",
          }}
        >
          <ItemDetail
            cartItem={curItem}
            currentCart={cartItems}
            closeCallback={() => setShowDetail(false)}
            updateItemCallback={itemDetailCallback}
          />
        </div>
      </Slide>
      <Dialog open={showRemoveConfirmation} onClose={dismissRemoveConfirmation}>
        <DialogTitle>Confirm item removal?</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={dismissRemoveConfirmation}
          >
            Cancel
          </Button>
          <MuiThemeProvider theme={ErrorTheme}>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                confirmDeleteCallback(removeBarcode);
                dismissRemoveConfirmation();
              }}
            >
              Remove
            </Button>
          </MuiThemeProvider>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ScanStore;
