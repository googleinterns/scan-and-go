import { CartItem } from "./../interfaces";
import { PRICE_FRACTION_DIGITS } from "../constants";

export const getTotalPrice = (cartItems: CartItem[]) => {
  let tot_price = 0.0;
  for (let cartItem of cartItems) {
    tot_price += cartItem.quantity * cartItem.item.price;
  }
  return tot_price.toFixed(PRICE_FRACTION_DIGITS);
};

export const getSubtotalPrice = (cartItem: CartItem) => {
  return (cartItem.quantity * cartItem.item.price).toFixed(
    PRICE_FRACTION_DIGITS
  );
};
