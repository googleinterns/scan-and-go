import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StoreHeader from "src/components/StoreHeader";
import ItemCard from "src/components/ItemCard";
import Cart from "src/components/Cart";
import CartHeader from "src/components/CartHeader";
import TextInputField from "src/components/TextInputField";
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
} from "@material-ui/core";
import { MuiThemeProvider } from "@material-ui/core/styles";
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
import { urlGetParam, emptyArray } from "src/utils";
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

  const history = useHistory();

  const [curStore, setCurStore] = useState<Store>(emptyStore());
  const [cartItems, updateCart] = useState<(CartItem | null)[]>([]);
  const [showCompactCart, setShowCompactCart] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const [debugBarcode, setDebugBarcode] = useState<string>("");

  const addItemToCart = async (barcode: string) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem && cartItem.item.barcode === barcode
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
        cartItems.filter(
          (cartItem) => cartItem && cartItem.item.barcode !== barcode
        )
      );
    } else {
      updateCart(
        cartItems.map((cartItem) => {
          if (cartItem && cartItem.item.barcode === barcode) {
            return Object.assign({}, cartItem, { quantity: quantity });
          }
          return cartItem;
        })
      );
    }
  };

  const updateNewItem = async (barcode: string) => {
    const origItems = [...cartItems];
    // Add a placeholder item first
    updateCart([...origItems, null]);
    const item: Item = await getItem(barcode, merchantID);
    // Override placeholder item when we receive actual info
    if (item) {
      updateCart([
        ...origItems,
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
    <div className="ScanStore">
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
                control={<Switch onChange={toggleDebug} color="secondary" />}
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
        <button id="testScanBtn" onClick={() => addItemToCart(debugBarcode)}>
          Test Add Item
        </button>,
      ]}
      <Divider />
      <Cart
        contents={cartItems}
        collapse={showCompactCart}
        updateItemQuantity={updateItemQuantity}
      />
      <Fab
        style={{ position: "fixed", bottom: "10px", right: "10px" }}
        color="primary"
        onClick={makePayment}
      >
        <PaymentIcon />
      </Fab>
    </div>
  );
}

export default ScanStore;
