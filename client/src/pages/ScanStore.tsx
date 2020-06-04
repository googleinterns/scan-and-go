import React, { useEffect, useState } from "react";
import StoreHeader from "./../components/StoreHeader";
import Cart from "./../components/Cart";
import Divider from "@material-ui/core/Divider";
import { Item, emptyItem, CartItem, emptyCartItem } from "./../interfaces";
import { fetchJson } from "./../utils";
import { TextInputField } from "./../components/Components";

function ScanStore() {
  // Update URL params to find storeID
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);
  const storeID = urlParams.get("id");
  const merchantID = urlParams.get("mid");

  // Toggle Cart Display
  const [showCart, setShowCart] = useState(false);

  // Declare list of items in our cart
  const [shoppingList, setShoppingList] = useState<CartItem[]>([]);

  //TODO: Look into `class ScanStore extends React.Component` syntax
  //      in order to declare class-level instance variables (cache cart)
  let cartItems: CartItem[] = [];

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

  const addItem = (barcode: string) => {
    let barcodes: string[] = [barcode];
    fetchItem(barcodes);
  };

  const fetchItem = async (barcodes: string[]) => {
    let data = {
      "merchant-id": merchantID,
      barcode: barcodes,
    };
    fetchJson(data, "/api/items", displayItems);
  };

  const displayItems = (extractedItems: Item[]) => {
    // Build barcode:idx mapping
    let idxMap: { [key: string]: number } = {};
    // Retrieve from State first
    for (let i = 0; i < shoppingList.length; ++i) {
      cartItems.push(shoppingList[i]);
      const barcode: string = shoppingList[i].item.barcode;
      idxMap[barcode] = i;
    }
    console.log(idxMap);
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

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  useEffect(() => {
    if (shoppingList.length > 0) {
      console.log("Save Cart to server");
    }
  }, [shoppingList]);

  // Html DOM element returned
  return (
    <div className="ScanStore">
      <a href="/">back</a>
      {!showCart && [
        <StoreHeader store_id={storeID} />,
        <h1>Scanned Items:</h1>,
        <Divider />,
        <TextInputField text="...barcode" callback={addItem} />,
      ]}
      {!showCart && shoppingList.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {shoppingList.map((curItem: CartItem) => (
              <tr key={curItem.item.barcode}>
                <td>{curItem.item.name}</td>
                <td>{curItem.item.price}</td>
                <td>{curItem.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Divider />
      <button onClick={toggleCart}>
        {showCart ? "Close Cart" : "View Cart"}
      </button>
      {showCart && <Cart contents={shoppingList} />}
    </div>
  );
}

export default ScanStore;
