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
import ReceiptHeader from "src/components/ReceiptHeader";

function Cart({
  contents,
  collapse,
  updateItemQuantity,
  showMedia = true,
}: {
  contents: CartItem[];
  collapse: boolean;
  updateItemQuantity?: (barcode: string, quantity: number) => void;
  showMedia?: boolean;
}) {
  return (
    <div className="Cart">
      {contents.length > 0 && collapse && <ReceiptHeader />}
      {contents.length > 0 &&
        contents.map((cartItem: CartItem) => {
          const cardProps = {
            key: cartItem.item.barcode,
            cartItem: cartItem,
            updateItemQuantity: updateItemQuantity
              ? updateItemQuantity
              : () => {},
          };
          return collapse ? (
            <ItemCardCompact {...cardProps} showMedia={false} />
          ) : (
            <ItemCard {...cardProps} />
          );
        })}
    </div>
  );
}

export default Cart;
