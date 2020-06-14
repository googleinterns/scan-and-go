import React, { useEffect, useState } from "react";
import { Item, emptyItem, CartItem, emptyCartItem } from "./../interfaces";
import {
  Fab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";

function Cart({ contents }: { contents: CartItem[] }) {
  const getTotalPrice = () => {
    let tot_price = 0.0;
    contents.forEach(cartItem => {
      tot_price += cartItem.quantity * cartItem.item.price;
    });
    return tot_price.toFixed(2);
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
                <TableCell>
                  {(curItem.quantity * curItem.item.price).toFixed(2)}
                </TableCell>
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
