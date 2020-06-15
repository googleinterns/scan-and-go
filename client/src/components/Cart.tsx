import React, { useEffect, useState } from "react";
import { CartItem } from "./../interfaces";
import { PRICE_FRACTION_DIGITS } from "../constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

function Cart({ contents }: { contents: CartItem[] }) {
  // TODO (#63): Separate UI and logic
  const getTotalPrice = () => {
    let tot_price = 0.0;
    for (let cartItem of contents) {
      tot_price += cartItem.quantity * cartItem.item.price;
    }
    return tot_price.toFixed(PRICE_FRACTION_DIGITS);
  };

  const getSubtotalPrice = (cartItem: CartItem) => {
    return (cartItem.quantity * cartItem.item.price).toFixed(2);
  };

  return (
    <div className="Cart">
      {contents.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contents.map((curItem: CartItem) => (
              <TableRow key={curItem.item.barcode}>
                <TableCell>{curItem.item.name}</TableCell>
                <TableCell>{curItem.quantity}</TableCell>
                <TableCell>{getSubtotalPrice(curItem)}</TableCell>
              </TableRow>
            ))}
            <TableRow key="total">
              <TableCell>Total Price:</TableCell>
              <TableCell></TableCell>
              <TableCell>{getTotalPrice()}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Cart;
