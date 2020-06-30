import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import StoreHeader from "src/components/StoreHeader";
import ItemCard from "src/components/ItemCard";
import Cart from "src/components/Cart";
import CartHeader from "src/components/CartHeader";
import TextInputField from "src/components/TextInputField";
import { Fab, Box, Divider, Grid, Paper, Typography } from "@material-ui/core";
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
import { BrowserMultiFormatReader } from "@zxing/library";
import {
  HOME_PAGE,
  RECEIPT_PAGE,
  ITEM_LIST_API,
  BARCODE_PLACEHOLDER,
} from "src/constants";
import { microapps } from "src/config";
import SampleBarcode from "src/img/Sample_EAN8.png";
declare const window: any;

// Flag to toggle display of taken image (for debugging)
const debugImg = true;

function ScanStore() {
  const storeID = urlGetParam("id");
  const merchantID = urlGetParam("mid");

  const history = useHistory();

  const [curStore, setCurStore] = useState<Store>(emptyStore());
  const [cartItems, updateCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [uploadImg, setUploadImg] = useState<MediaResponse>(
    emptyMediaResponse()
  );

  const debugImgId = "testImgSrc";
  const uploadImgId = "uploadImgSrc";

  const [curBarcode, setCurBarcode] = useState<string>("");

  // TODO (#56): Separate UI and control functions
  const addItem = async () => {
    if (!curBarcode) {
      // If empty, use media API
      const imgReq = {
        allowedMimeTypes: ["image/jpeg"],
        allowedSources: ["camera"], // Restrict to camera scanning only
      };
      const imgRes = await microapps.requestMedia(imgReq);
      setUploadImg(imgRes);
    } else {
      addItemToCart(curBarcode);
    }
  };

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
    const item: Item = await getItem(barcode, merchantID);
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

  const renderShoppingList = () => {
    return cartItems.map((cartItem) => {
      return (
        <Grid key={cartItem.item.barcode} item xs={12}>
          <ItemCard
            cartItem={cartItem}
            updateItemQuantity={updateItemQuantity}
          />
        </Grid>
      );
    });
  };

  const toggleCart = () => {
    setShowCart(!showCart);
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

  const processImageBarcode = async (img: HTMLImageElement) => {
    const codeReader = new BrowserMultiFormatReader();
    if (img) {
      const result = await codeReader
        .decodeFromImage(img)
        .then((res: any) => res.text);
      addItemToCart(result);
      setCurBarcode(result);
    }
  };

  const testBarcode = () => {
    const img = document.getElementById(debugImgId) as HTMLImageElement;
    processImageBarcode(img);
  };

  // Upon entering page, grab store details
  useEffect(() => {
    if (storeID) {
      getStoreInfo(storeID).then((res) => setCurStore(res));
    }
  }, []);

  // When we change what image we uploaded, run extract barcode client-side
  useEffect(() => {
    if (uploadImg.mimeType) {
      // Have something
      const img = document.getElementById(uploadImgId) as HTMLImageElement;
      processImageBarcode(img);
    }
  }, [uploadImg]);

  return (
    <div className="ScanStore">
      <CartHeader store={curStore} scanBarcodeCallback={addItem} />
      <Grid container spacing={1} direction="column" alignItems="stretch">
        {!showCart && (
          <Grid item xs={12}>
            <Paper elevation={1}>
              <Box p={1}>
                <Grid item container direction="row" alignItems="center">
                  {/* TODO (#60): Keep Cart or Shopping List, but not both */}
                  <Grid item xs={6}>
                    <h1>Shopping List:</h1>
                  </Grid>
                  <Grid item xs={6}>
                    <TextInputField
                      text={curBarcode ? curBarcode : BARCODE_PLACEHOLDER}
                      setState={setCurBarcode}
                    />
                  </Grid>
                </Grid>
                {cartItems.length > 0 && (
                  <Grid
                    container
                    spacing={1}
                    direction="column"
                    alignItems="stretch"
                  >
                    <Grid
                      container
                      direction="row"
                      justify="center"
                      alignItems="center"
                    >
                      <Grid item xs={3}></Grid>
                      <Grid item xs={3}>
                        <Typography variant="subtitle1">Name</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="subtitle1">Unit Price</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="subtitle1">Subtotal</Typography>
                      </Grid>
                      <Grid item xs={2}></Grid>
                    </Grid>
                    <Divider />
                    {renderShoppingList()}
                  </Grid>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
        <button id="testScanBtn" onClick={testBarcode}>
          Test Barcode API
        </button>
        <img
          id={debugImgId}
          hidden={true}
          width="200"
          height="200"
          src={SampleBarcode}
        />
        {uploadImg.mimeType && (
          <Grid item xs={12} justify="center">
            <Paper elevation={2}>
              <img
                id={uploadImgId}
                hidden={!debugImg}
                width="200"
                height="200"
                src={
                  "data:" + uploadImg.mimeType + ";base64," + uploadImg.bytes
                }
              />
            </Paper>
          </Grid>
        )}
      </Grid>
      {showCart && [
        <h3>Current Cart Contents:</h3>,
        <Cart contents={cartItems} />,
      ]}
      <Fab
        style={{ position: "fixed", bottom: "10px", left: "10px" }}
        color="primary"
        onClick={toggleCart}
      >
        {showCart ? <EditIcon /> : <ShoppingCartIcon />}
      </Fab>
      <Fab
        style={{ position: "fixed", bottom: "10px", right: "10px" }}
        color="secondary"
        onClick={showCart ? makePayment : addItem}
      >
        {showCart ? <PaymentIcon /> : <AddIcon />}
      </Fab>
    </div>
  );
}

export default ScanStore;
