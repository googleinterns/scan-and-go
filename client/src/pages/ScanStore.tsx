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
  emptyItem,
  CartItem,
  emptyCartItem,
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

function ScanStore(props: any) {
  // Update URL params to find storeID
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);
  const storeID = urlParams.get("id");
  const merchantID = urlParams.get("mid");

  // Toggle Cart Display
  const [showCart, setShowCart] = useState(false);

  // Declare list of items in our cart
  const [shoppingList, setShoppingList] = useState<CartItem[]>([]);

  //DEBUGGING Current barcode to 'scan'
  const [curBarcode, setCurBarcode] = useState<string>("");

  // Uploaded image data
  const [uploadImg, setUploadImg] = useState<MediaResponse>(emptyMediaResponse);

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
    fetchJson(data, "/api/cart", fetchCartCallback);
  };

  const fetchCartCallback = async (items: any) => {
    // Empty cart contents
    cartItems.length = 0;
    // replace with current items
    for (let i = 0; i < items.length; ++i) {
      cartItems.push(items[i]);
    }
    // Should do batched fetch with list of barcodes in 1 request-response
    const item_barcodes = items.map((zippedItem: any) => zippedItem.barcode);
    let data = {
      //'merchant-id': merchantID,
      "store-id": storeID,
      items: item_barcodes,
    };
    fetchJson(data, "/api/items", fetchCartItemsCallback);
  };

  const fetchCartItemsCallback = (extractedItems: any) => {
    updateShoppingList(cartItems, extractedItems);
  };

  const updateShoppingList = (items: any, extractedItems: any) => {
    const sList = items.map((zippedItem: any) => {
      let cItem = emptyCartItem();
      cItem.item = extractedItems[zippedItem.barcode];
      cItem.quantity = zippedItem.quantity;
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
      const imgRes = await window.microapps
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
      fetchJson(data, "/api/items", displayItems);
    }
  };

  const displayItems = (extractedItems: Item[]) => {
    for (let i = 0; i < extractedItems.length; ++i) {
      console.log(idxMap[extractedItems[i].barcode]);
      if (idxMap[extractedItems[i].barcode] != undefined) {
        console.log("Add quantity: " + extractedItems[i].barcode);
        cartItems[idxMap[extractedItems[i].barcode]].quantity += 1;
      } else {
        console.log("New item: " + extractedItems[i].barcode);
        let newItem = emptyCartItem();
        newItem.item = extractedItems[i];
        newItem.quantity = 1;
        cartItems.push(newItem);
      }
    }
    setShoppingList(cartItems);
  };

  const updateShoppingListQuantity = (idx: number, quantity: number) => {
    console.log(idx);
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
            item={shoppingList[i]}
            idx={i}
            callback={updateShoppingListQuantity}
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
    console.log("Map Built");
    console.log(idxMap);
  };

  const makePayment = () => {
    console.log("Attempting to make payment for:");
    console.log(shoppingList);
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

  // Logging purposes for showing of cart
  /*useEffect(() => {
    console.log("Toggle Show Cart");
    console.log(shoppingList);
  }, [showCart]);*/

  // When we update shoppingList, we should send update to server?
  useEffect(() => {
    if (shoppingList.length > 0) {
      console.log("Save Cart to server");
    }
  }, [shoppingList]);

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

  // Html DOM element returned
  return (
    <Container disableGutters={true} className="ScanStore">
      <Grid container spacing={1} direction="column" alignItems="stretch">
        <Grid item xs={12}>
          <Paper elevation={1}>
            <StoreHeader store_id={storeID} />
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
                      text={curBarcode ? curBarcode : "...barcode"}
                      callback={setDebugItem}
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
