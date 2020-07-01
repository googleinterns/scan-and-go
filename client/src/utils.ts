import { CartItem } from "src/interfaces";
import { DAY_PERIOD, PRICE_FRACTION_DIGITS } from "src/constants";
import { microapps, isWeb } from "./config";

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

const getIdToken = async () => {
  let idToken = "";
  if (!isWeb) {
    // Microapp flow
    const nonce = await fetchText("GET", {}, "/api/nonce");
    const request = { nonce: nonce };
    idToken = microapps.getIdentity(request).catch((err: any) => {
      return null;
    });
  } else {
    // Web flow with Google Sign-In https://developers.google.com/identity/sign-in/web
    // Load and initialize the GoogleAuth object, otherwise throws gapi/auth2 is not defined error
    await new Promise((resolve, reject) => {
      gapi.load("auth2", resolve);
    });
    gapi.auth2.init({ client_id: process.env.REACT_APP_MICROAPPS_CLIENT_ID });

    // Force refresh is necessary to get a non-empty AuthResponse
    const googleUser = gapi.auth2.getAuthInstance().currentUser.get();
    idToken = await googleUser.reloadAuthResponse().then((res) => res.id_token);
  }
  return idToken;
};

const setHeaders = async (auth: Boolean = false) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });
  if (auth) {
    const idToken = await getIdToken();
    headers.append("Authorization", "Bearer " + idToken);
  }
  return headers;
};

// fetch response from url
const fetchRes = async (
  reqType: string,
  data: Object = {},
  url: string,
  auth: Boolean = false
) => {
  const headers = await setHeaders(auth);
  let body;
  if (reqType == "POST") {
    body = JSON.stringify(data);
  }
  return await fetch(url, {
    method: reqType,
    credentials: "include",
    headers: headers,
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: body,
  });
};

// fetch json response from url
export const fetchJson = async (
  reqType: string,
  data: any,
  url: string,
  auth: Boolean = false
) => {
  return fetchRes(reqType, data, url, auth)
    .then((res) => getJson(res))
    .catch((err) => catchErr(err));
};

// fetch text response from url
export const fetchText = async (
  reqType: string,
  data: any,
  url: string,
  auth: Boolean = false
) => {
  return fetchRes(reqType, data, url, auth)
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

// Returns a list of strings
export const parseRawTextNewlines = (text: string): string[] => {
  return text.split("%0A"); // %0A URL encoded \n newline character
};

// Returns formatted address seperated into lines
export const parseRawAddressNewlines = (addr: string): string[] => {
  return addr.split(",");
};

// Deep checking of element's children for string match
// note: tradeoff for doing map-reduce, no early termination on match
export const deepHtmlStringMatch = (element: any, match: string) => {
  // Base case for string matching entire element
  if (typeof element === "string") {
    return element === match;
  }
  // Return false if no contents
  // note ordering of if statements, next check will guarantee
  // some element.props.children exists
  if (!element.props || !element.props.children) {
    return false;
  }
  // Second base case for only 1 children (not in array)
  if (typeof element.props.children === "string") {
    return element.props.children === match;
  }
  // Treat children list as potentially other elements and
  // recursively call this matching function
  // reduce return value with || to get final matching result
  return element.props.children
    .map((child: any) => deepHtmlStringMatch(child, match))
    .reduce((accum: boolean, cur: boolean) => accum || cur);
};
