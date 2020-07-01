import React from "react";
import { CartItem } from "src/interfaces";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from "@material-ui/core";
import * as Experiments from "src/experiments";
import ItemCard from "src/components/ItemCard";
import ItemCardCompact from "src/components/ItemCardCompact";

function Cart({
  contents,
  collapse,
  updateItemQuantity,
}: {
  contents: CartItem[];
  collapse: boolean;
  updateItemQuantity?: (barcode: string, quantity: number) => void;
}) {
  return (
    <div className="Cart">
      {contents.length > 0 &&
        contents.map((cartItem) => {
          const cardProps = {
            key: cartItem.item.barcode,
            cartItem: cartItem,
            updateItemQuantity: updateItemQuantity
              ? updateItemQuantity
              : (barcode: string, quantity: number) => {},
          };
          return collapse ? (
            <ItemCardCompact {...cardProps} />
          ) : (
            <ItemCard {...cardProps} />
          );
        })}
    </div>
  );
}

export default Cart;
