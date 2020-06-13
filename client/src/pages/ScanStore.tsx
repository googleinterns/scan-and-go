import React, { useEffect, useState } from "react";
import StoreHeader from "./../components/StoreHeader";
import ItemCard from "./../components/ItemCard";
import Cart from "./../components/Cart";
import {
  Fab,
  Box,
  Container,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import EditIcon from "@material-ui/icons/Edit";
import PaymentIcon from "@material-ui/icons/Payment";
import AddIcon from "@material-ui/icons/Add";
import {
  Item,
  CartItem,
  MediaResponse,
  emptyMediaResponse,
} from "./../interfaces";
import { fetchJson } from "./../utils";
import { TextInputField } from "./../components/Components";
import { BrowserMultiFormatReader } from "@zxing/library";
import SampleBarcode from "./../img/Sample_EAN8.png";
declare const window: any;

//Yiheng: For whether we should display our uploaded image for debugging
const debugImg = true;

function ScanStore() {
  // TODO (#27): Extract logic to get parameters as a function
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);
  const storeID = urlParams.get("id");
  const merchantID = urlParams.get("mid");

  const [cartItems, updateCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [curBarcode, setCurBarcode] = useState<string>("");
  const [uploadImg, setUploadImg] = useState<MediaResponse>(emptyMediaResponse);

  // TODO (#56): Separate UI and control functions
  const addItem = async () => {
    let barcode = curBarcode;
    if (barcode === "") {
      barcode = await getBarcodeByImage();
    } 
    addItemToCart(barcode);
  };

  const addItemToCart = async (barcode: string) => {
    const existingItem = cartItems.find(cartItem => cartItem.item.barcode == barcode);
    if (existingItem) {
      updateItemQuantity(barcode, existingItem.quantity + 1);
    } else {
      updateNewItem(barcode);
    }
  };

  const updateItemQuantity = (barcode: string, quantity: number) => {
    if (quantity <= 0) {
      updateCart(cartItems.filter(cartItem => cartItem.item.barcode !== barcode));
    } else {
      updateCart(cartItems.map(cartItem => {
        if (cartItem.item.barcode === barcode) {
          cartItem.quantity = quantity;
        }
        return cartItem;
      }));
    }
  };

  const updateNewItem = async (barcode: string) => {
    const data = {
      "merchant-id": merchantID,
      barcode: [barcode]
    };
    const [ item ]: Item[] = await fetchJson(data, "/api/items");
    if (item) {
      const cartItem: CartItem = {
        item: item,
        quantity: 1
      }
      updateCart(cartItems => [...cartItems, cartItem]);
    }
    // TODO (#59): Notify user if barcode is invalid or item not found
  }

  const renderShoppingList = () => {
    return cartItems.map(cartItem => {
      return <Grid key={cartItem.item.barcode} item xs={12}>
        <ItemCard
          cartItem={cartItem}
          updateItemQuantity={updateItemQuantity}
        />
      </Grid>
    });
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const makePayment = () => {
    //Yiheng: This should be just an ID without exposing the contents of our Order
    window.location.href =
      "/receipt?id=TEST_ORDER&contents=" +
      encodeURIComponent(JSON.stringify(cartItems));
  };

  const getBarcodeByImage = async () => {
    let barcode = "";
    const imgReq = {
      allowedMimeTypes: ["image/jpeg"],
      allowedSources: ["camera"], // Restrict to camera scanning only
    };
    const imgRes = await window.microapps
      .requestMedia(imgReq)
      .then((res: any) => res);
    setUploadImg(imgRes);
    if (imgRes.mimeType) {
      const img = document.getElementById("uploadImgSrc") as HTMLImageElement;
      barcode = await processImageBarcode(img);
    }
    return barcode;
  }

  const processImageBarcode = async (img: HTMLImageElement) => {
    const codeReader = new BrowserMultiFormatReader();
    let barcode = "";
    if (img) {
      barcode = await codeReader
        .decodeFromImage(img)
        .then((res: any) => res)
        .catch((err: any) => {
          return "";
        });
    } 
    return barcode;
  };

  const testBarcode = () => {
    const img = document.getElementById("testImgSrc") as HTMLImageElement;
    processImageBarcode(img);
  };

  return (
    <Container disableGutters={true} className="ScanStore">
      <Grid container spacing={1} direction="column" alignItems="stretch">
        <Grid item xs={12}>
          <Paper elevation={1}>
            <StoreHeader storeId={storeID} />
          </Paper>
        </Grid>
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
                      text={curBarcode ? curBarcode : "...barcode"}
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
        <button onClick={testBarcode}>Test Barcode API</button>
        <img
          id="testImgSrc"
          hidden={true}
          width="200"
          height="200"
          src={SampleBarcode}
        />
        {uploadImg.mimeType && (
          <Grid item xs={12} justify="center">
            <Paper elevation={2}>
              <img
                id="uploadImgSrc"
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
      </Fab>,
    </Container>
  );
}

export default ScanStore;
