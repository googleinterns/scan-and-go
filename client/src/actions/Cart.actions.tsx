import { CartItem } from "./../interfaces";
import { PRICE_FRACTION_DIGITS } from "../constants";

export const getTotalPrice = (cartItems: CartItem[]) => {
  let totPrice = 0.0;
  for (const cartItem of cartItems) {
    totPrice += cartItem.quantity * cartItem.item.price;
  }
  return totPrice.toFixed(PRICE_FRACTION_DIGITS);
};

export const getSubtotalPrice = (cartItem: CartItem) => {
  return (cartItem.quantity * cartItem.item.price).toFixed(
    PRICE_FRACTION_DIGITS
  );
};
