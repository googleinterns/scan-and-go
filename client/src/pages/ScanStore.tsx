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
import {
  CART_API,
  ITEM_LIST_API,
  BARCODE_PLACEHOLDER,
  microapps,
} from "../constants";
import SampleBarcode from "./../img/Sample_EAN8.png";
declare const window: any;

//Yiheng: For whether we should display our uploaded image for debugging
const debugImg = true;

function ScanStore() {
  // Update URL params to find storeID
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);
  const storeID = urlParams.get("id");
  const merchantID = urlParams.get("mid");

  const [showCart, setShowCart] = useState(false);
  const [shoppingList, setShoppingList] = useState<CartItem[]>([]);
  //DEBUGGING Current barcode to 'scan'
  const [curBarcode, setCurBarcode] = useState<string>("");

  // Uploaded image data
  const [uploadImg, setUploadImg] = useState<MediaResponse>(
    emptyMediaResponse()
  );

  //TODO: Look into `class ScanStore extends React.Component` syntax
  //      in order to declare class-level instance variables (cache cart)
  let cartItems: CartItem[] = [];
  // Build barcode:idx mapping
  let idxMap: { [key: string]: number } = {};

  // wrapper function to fetch cart items and execute callback upon success
  const fetchCart = async () => {
    let data = {
      "store-id": storeID,
    };
    const cart = await fetchJson("POST", data, CART_API);
    const items = await fetchCartItems(cart);
    updateShoppingList(cartItems, items);
  };

  const fetchCartItems = async (items: any) => {
    // Empty cart contents
    cartItems.length = 0;
    // replace with current items
    for (let i = 0; i < items.length; ++i) {
      cartItems.push(items[i]);
    }
    // Should do batched fetch with list of barcodes in 1 request-response
    const itemBarcodes = items.map((zippedItem: any) => zippedItem.barcode);
    let data = {
      //'merchant-id': merchantID,
      "store-id": storeID,
      items: itemBarcodes,
    };
    return fetchJson("POST", data, ITEM_LIST_API);
  };

  const updateShoppingList = (items: any, extractedItems: any) => {
    const sList = items.map((zippedItem: any) => {
      let cItem: CartItem = {
        item: extractedItems[zippedItem.barcode],
        quantity: zippedItem.quantity,
      };
      return cItem;
    });
    setShoppingList(sList);
  };

  const setDebugItem = (barcode: string) => {
    setCurBarcode(barcode);
    setShoppingList(cartItems);
  };

  const addItem = async () => {
    if (curBarcode == "") {
      // If empty, use media API
      const imgReq = {
        allowedMimeTypes: ["image/jpeg"],
        allowedSources: ["camera"], // Restrict to camera scanning only
      };
      const imgRes = await microapps
        .requestMedia(imgReq)
        .then((res: any) => res);
      setUploadImg(imgRes);
    } else {
      let barcodes: string[] = [curBarcode];
      fetchItem(barcodes);
    }
  };

  const fetchItem = async (barcodes: string[]) => {
    // Check first if we have previously retrieved this item
    let unknown_barcodes: string[] = [];
    let matchedItems: Item[] = [];
    for (let i = 0; i < barcodes.length; ++i) {
      if (idxMap[barcodes[i]] != undefined) {
        let matchedCartItem = cartItems[idxMap[barcodes[i]]];
        matchedItems.push(matchedCartItem.item);
      } else {
        unknown_barcodes.push(barcodes[i]);
      }
    }
    if (matchedItems.length > 0) {
      displayItems(matchedItems);
    } else if (unknown_barcodes.length > 0) {
      let data = {
        "merchant-id": merchantID,
        barcode: unknown_barcodes,
      };
      const items = await fetchJson("POST", data, ITEM_LIST_API);
      displayItems(items);
    }
  };

  const displayItems = (extractedItems: Item[]) => {
    for (let i = 0; i < extractedItems.length; ++i) {
      if (idxMap[extractedItems[i].barcode] != undefined) {
        cartItems[idxMap[extractedItems[i].barcode]].quantity += 1;
      } else {
        let newItem: CartItem = {
          item: extractedItems[i],
          quantity: 1,
        };
        cartItems.push(newItem);
      }
    }
    setShoppingList(cartItems);
  };

  const updateShoppingListQuantity = (idx: number, quantity: number) => {
    if (quantity <= 0) {
      cartItems.splice(idx, 1);
    } else {
      cartItems[idx].quantity = quantity;
    }
    setShoppingList(cartItems);
  };

  const renderShoppingList = () => {
    let UI_List = [];
    for (let i = 0; i < shoppingList.length; ++i) {
      UI_List.push(
        <Grid key={"grid" + i} item xs={12}>
          <ItemCard
            cartItem={shoppingList[i]}
            idx={i}
            updateItemQuantity={updateShoppingListQuantity}
          />
        </Grid>
      );
    }
    return UI_List;
  };

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const updateIdxMapping = () => {
    // Retrieve from State first
    for (let i = 0; i < shoppingList.length; ++i) {
      cartItems.push(shoppingList[i]);
      const barcode: string = shoppingList[i].item.barcode;
      idxMap[barcode] = i;
    }
  };

  const makePayment = () => {
    //Yiheng: This should be just an ID without exposing the contents of our Order
    window.location.href =
      "/receipt?id=TEST_ORDER&contents=" +
      encodeURIComponent(JSON.stringify(shoppingList));
  };

  const processImageBarcode = async (img: HTMLImageElement) => {
    const codeReader = new BrowserMultiFormatReader();
    if (img != null) {
      const result = await codeReader
        .decodeFromImage(img)
        .then((res: any) => res)
        .catch((err: any) => {
          console.log(err);
          return "";
        });
      console.log("Processed image: " + result);
      setDebugItem(result.text);
    } else {
      console.log("Cannot find element: uploadImgSrc");
    }
  };

  const testBarcode = () => {
    const img = document.getElementById("testImgSrc") as HTMLImageElement;
    processImageBarcode(img);
  };

  //TODO When we update shoppingList, we should send update to server?

  // When we change what image we uploaded, run extract barcode client-side
  useEffect(() => {
    if (uploadImg.mimeType) {
      // Have something
      const img = document.getElementById("uploadImgSrc") as HTMLImageElement;
      processImageBarcode(img);
    }
  }, [uploadImg]);

  // After rerendering of UI and React popping variables off our stack,
  // reinitialize vars
  // Also, race? Will this run before all other useEffects? What's the ordering of execution here?
  useEffect(() => {
    updateIdxMapping(); //TODO(#20) Yiheng: Tech Debt, we need to make this persist as Class Variable
  });

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
                  <Grid item xs={6}>
                    <h1>Shopping List:</h1>
                  </Grid>
                  <Grid item xs={6}>
                    <TextInputField
                      text={curBarcode ? curBarcode : BARCODE_PLACEHOLDER}
                      setState={setDebugItem}
                    />
                  </Grid>
                </Grid>
                {shoppingList.length > 0 && (
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
      <Fab
        style={{ position: "fixed", bottom: "10px", left: "10px" }}
        color="primary"
        onClick={toggleCart}
      >
        {showCart ? <EditIcon /> : <ShoppingCartIcon />}
      </Fab>
      {showCart && [
        <h3>Current Cart Contents:</h3>,
        <Cart contents={shoppingList} />,
        <Fab
          style={{ position: "fixed", bottom: "10px", right: "10px" }}
          color="secondary"
          onClick={makePayment}
        >
          <PaymentIcon />
        </Fab>,
      ]}
      {!showCart && (
        <Fab
          style={{ position: "fixed", bottom: "10px", right: "10px" }}
          color="secondary"
          onClick={addItem}
        >
          <AddIcon />
        </Fab>
      )}
    </Container>
  );
}

export default ScanStore;
