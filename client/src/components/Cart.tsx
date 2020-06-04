import React, { useEffect, useState } from "react";
import { Item, emptyItem, CartItem, emptyCartItem } from "./../interfaces";

function Cart(props: any) {
  // Update the current store we're in
  const contents: CartItem[] = props.contents;

  const makePayment = () => {
    console.log("Attempting to make payment for:");
    console.log(contents);
  };

  const getTotalPrice = () => {
    let tot_price = 0.0;
    for (let i = 0; i < contents.length; ++i) {
      tot_price += contents[i].quantity * contents[i].item.price;
    }
    return tot_price.toFixed(2);
  };

  // Html DOM element returned
  return (
    <div className="Cart">
      <h3>Current Cart Contents:</h3>
      {contents.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((curItem: CartItem) => (
              <tr key={curItem.item.barcode}>
                <td>{curItem.item.name}</td>
                <td>{curItem.quantity}</td>
                <td>{(curItem.quantity * curItem.item.price).toFixed(2)}</td>
              </tr>
            ))}
            <tr key="total">
              <td>Total Price:</td>
              <td></td>
              <td>{getTotalPrice()}</td>
            </tr>
          </tbody>
        </table>
      )}
      <button onClick={makePayment}>Checkout</button>
    </div>
  );
}

export default Cart;
