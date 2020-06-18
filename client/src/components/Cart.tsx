import React from "react";
import { CartItem } from "./../interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@material-ui/core";
import { getSubtotalPrice, getTotalPrice } from "../actions/Cart.actions";

function Cart({ contents }: { contents: CartItem[] }) {
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
              <TableCell>{getTotalPrice(contents)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Cart;
