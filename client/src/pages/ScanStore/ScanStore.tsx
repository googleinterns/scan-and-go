import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StoreHeader from "src/components/StoreHeader";
import ItemCard from "src/components/ItemCard";
import Cart from "src/components/Cart";
import CartHeader from "src/components/CartHeader";
import TextInputField from "src/components/TextInputField";
import PlaceholderCart from "src/components/PlaceholderCart";
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
  HOME_PAGE,
  RECEIPT_PAGE,
  ITEM_LIST_API,
  BARCODE_PLACEHOLDER,
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
  const [cartItems, updateCart] = useState<CartItem[]>([]);
  const [loadingItem, setLoadingItem] = useState<boolean>(false);
  const [showCompactCart, setShowCompactCart] = useState<boolean>(false);
  const [showDebug, setShowDebug] = useState<boolean>(false);
  const [showFooter, setShowFooter] = useState<boolean>(true);
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
      updateCart(
        cartItems.filter((cartItem) => cartItem.item.barcode !== barcode)
      );
    } else {
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
    if (item) {
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

  const makePayment = () => {
    //TODO(#48) This should be just an ID without exposing the contents of our Order
    history.push({
      pathname: RECEIPT_PAGE,
      search: "?id=TEST_ORDER", // Temporary placeholder
      state: {
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
    <div className="ScanStore" style={{ height: "100%" }}>
      <Grid
        container
        direction="column"
        style={{ height: "100%" }}
        alignItems="stretch"
      >
        <Grid item>
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
            <button
              id="testScanBtn"
              onClick={() => addItemToCart(debugBarcode)}
            >
              Test Add Item
            </button>,
          ]}
          <Divider />
        </Grid>
        <Grid item xs style={{ overflow: "scroll" }}>
          <Grid item container direction="column">
            <Grid item>
              <Cart
                contents={cartItems}
                collapse={showCompactCart}
                updateItemQuantity={updateItemQuantity}
              />
            </Grid>
            <Grid item>{loadingItem && <PlaceholderCart length={1} />}</Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item container direction="row" justify="center">
            <div
              onClick={() => setShowFooter(!showFooter)}
              style={{ zIndex: 1000, cursor: "pointer", marginTop: "-24px" }}
            >
              {showFooter ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </div>
          </Grid>
          <Collapse in={showFooter} unmountOnExit={true}>
            <Grid item>
              <Divider />
              <Typography variant="subtitle1" align="right">
                Subtotal: $xx.xx
              </Typography>
              <Typography variant="subtitle1" align="right">
                Total: $xxx.xx
              </Typography>
            </Grid>
          </Collapse>
          <Grid item style={{ paddingBottom: theme.spacing(2) }}>
            <Button
              fullWidth={true}
              variant="contained"
              color="primary"
              onClick={makePayment}
            >
              Checkout
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default ScanStore;
