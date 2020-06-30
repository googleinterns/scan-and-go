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
        contents.map((cartItem) =>
          collapse ? (
            <ItemCardCompact key={cartItem.item.barcode} cartItem={cartItem} />
          ) : (
            <ItemCard
              key={cartItem.item.barcode}
              cartItem={cartItem}
              updateItemQuantity={
                updateItemQuantity
                  ? updateItemQuantity
                  : (barcode: string, quantity: number) => {}
              }
            />
          )
        )}
    </div>
  );
}

export default Cart;
