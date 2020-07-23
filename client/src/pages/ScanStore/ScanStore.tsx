import React, { useEffect, useState } from "react";
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
import { getStoreInfo, getItem } from "src/pages/Actions";
import {
  BARCODE_PLACEHOLDER,
  PRICE_FRACTION_DIGITS,
  CHECKOUT_PAGE,
} from "src/constants";
import { microapps, isWeb, isDebug } from "src/config";
import { ErrorTheme } from "src/theme";
declare const window: any;

// Flag to toggle display of taken image (for debugging)
const debugImg = true;

function ScanStore() {
  const storeID = urlGetParam("id");
  const merchantID = urlGetParam("mid");

  const theme = useTheme();
  const history = useHistory();

  const [curStore, setCurStore] = useState<Store>(emptyStore());
  const [curItem, setCurItem] = useState<CartItem>();
  const [cartItems, updateCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0.0);
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  const [showCompactCart, setShowCompactCart] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(true);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [debugBarcode, setDebugBarcode] = useState<string>("");

  const addItemToCart = async (barcode: string) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.item.barcode === barcode
    );
    if (existingItem) {
      updateItemQuantity(barcode, existingItem.quantity + 1);
    } else {
      updateNewItem(barcode);
    }
  };

  const updateItemQuantity = (barcode: string, quantity: number) => {
    if (quantity <= 0) {
      if (curItem)
        setCurItem(Object.assign({}, curItem, { quantity: quantity }));
      //TODO(#200): Block user from removing item with confirmation dialog
      updateCart(
        cartItems.filter((cartItem) => cartItem.item.barcode !== barcode)
      );
      if (curItem && curItem.item.barcode === barcode) {
        setShowDetail(false);
      }
    } else {
      if (curItem && curItem.item.barcode === barcode) {
        setCurItem(Object.assign({}, curItem, { quantity: quantity }));
      }
      updateCart(
        cartItems.map((cartItem) => {
          if (cartItem.item.barcode === barcode) {
            return Object.assign({}, cartItem, { quantity: quantity });
          }
          return cartItem;
        })
      );
    }
  };

  const updateNewItem = async (barcode: string) => {
    setLoadingItem(true);
    const item: Item = await getItem(barcode, merchantID);
    setLoadingItem(false);
    // Override placeholder item when we receive actual info
    if (item.barcode) {
      updateCart([
        ...cartItems,
        {
          item: item,
          quantity: 1,
        },
      ]);
    }
    // TODO (#59): Notify user if barcode is invalid or item not found
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

  const makePayment = () => {
    //TODO(#48) This should be just an ID without exposing the contents of our Order
    history.push({
      pathname: CHECKOUT_PAGE,
      state: {
        store: curStore,
        contents: cartItems,
      },
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
              scanBarcodeCallback={addItemToCart}
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
              <button onClick={() => addItemToCart(debugBarcode)}>
                Test Add Item
              </button>,
              <FormControlLabel
                checked={showDetail}
                control={<Switch onChange={toggleDetail} color="primary" />}
                label="Show Item Detail"
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
            <Grid item>{loadingItem && <PlaceholderCart length={1} />}</Grid>
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
                onClick={makePayment}
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
            updateItemQuantity={updateItemQuantity}
            closeCallback={() => setShowDetail(false)}
          />
        </div>
      </Slide>
    </div>
  );
}

export default ScanStore;
