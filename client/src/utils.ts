import { CartItem } from "src/interfaces";
import { DAY_PERIOD, PRICE_FRACTION_DIGITS } from "src/constants";

// Get json from response
const getJson = (res: any) => {
  if (res.ok) {
    let res_json = res.json();
    return res_json;
  } else {
    console.error(`Response code: ${res.status}`);
    return null;
  }
};

// Get text from response
const getText = (res: any) => {
  let res_text = res.text();
  if (res.ok) {
    return res_text;
  } else {
    console.error(`Response code: ${res.status}`);
    return null;
  }
};

// Log to error any errors in fetch instead of alerts
// which will not show up when debugging in microapps env
// and is highly disruptive for user-flow on web
const catchErr = (err: any) => {
  console.error("Error: " + err);
};

// fetch response from url
const fetchRes = async (reqType: string, data: any, url: string) => {
  if (data == null) {
    return await fetch(url);
  } else {
    return await fetch(url, {
      method: reqType,
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
  }
};

// fetch json response from url
export const fetchJson = async (reqType: string, data: any, url: string) => {
  return fetchRes(reqType, data, url)
    .then((res) => getJson(res))
    .catch((err) => catchErr(err));
};

// fetch text response from url
export const fetchText = async (reqType: string, data: any, url: string) => {
  return fetchRes(reqType, data, url)
    .then((res) => getText(res))
    .catch((err) => catchErr(err));
};

// Extract Identity Token from getIdentity() call response
export const extractIdentityToken = (response: string) => {
  // Token response is base64 encoded from getIdentity() API call
  // Furthermore, it is split into period-separated sections
  // [0] describes the encryption scheme used
  // [1] identity Token JSON object we require
  return JSON.parse(atob(response.split(".")[1]));
};

// Grab url parameter
export const urlGetParam = (param: string): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Decode json from encoded url parameter
export const urlGetJson = (param: string) => {
  const rawEncoded = urlGetParam(param);
  if (rawEncoded) {
    const decodedJsonString = decodeURIComponent(rawEncoded);
    if (decodedJsonString) {
      return JSON.parse(decodedJsonString);
    }
  }
};

// Grab the current period of day for user
export const getDayPeriod = () => {
  const NIGHT_LIM = 5;
  const MORNING_LIM = 11;
  const NOON_LIM = 13;
  const AFTERNOON_LIM = 18;
  const EVENING_LIM = 22;
  const curHour = new Date().getHours();
  if (curHour < NIGHT_LIM) {
    return DAY_PERIOD.NIGHT;
  } else if (curHour < MORNING_LIM) {
    return DAY_PERIOD.MORNING;
  } else if (curHour < NOON_LIM) {
    return DAY_PERIOD.NOON;
  } else if (curHour < AFTERNOON_LIM) {
    return DAY_PERIOD.AFTERNOON;
  } else if (curHour < EVENING_LIM) {
    return DAY_PERIOD.EVENING;
  } else {
    return DAY_PERIOD.NIGHT;
  }
};

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
