/*
 * priceLibrary.ts - Stand in for rigorous pricing computation library
 */

export const GST_PERCENTAGE = 7;

export const priceSum = (first: number, second: number) => {
  return first + second;
};

export const priceMul = (price: number, multiplier: number) => {
  return price * multiplier;
};

export const priceSumArray = (prices: number[]) => {
  // Handle empty array case
  if (prices.length === 0) return 0.0;
  return prices.reduce((accum: number, cur: number) => priceSum(accum, cur));
};

export const priceGetGST = (price: number) => {
  return (price * GST_PERCENTAGE) / 100;
};
