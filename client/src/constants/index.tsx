declare const window: any;

export const isDebug = false;

// Grab a handle to our microapps javascript library
export const microapps = window.microapps;

// Grab handle to google client js API
export const google = window.google;

// Detect if our app is running from within an iframe
// On a normal site, the window.parent variable will
// reference itself. However, within the microapps environment
// window will be the iframe and window.parent will not be visible
export const isWeb = window == window.parent;

// API endpoints
export const API = "/api/";
export const CART_API = "/api/cart";
export const ITEM_API = "/api/item";
export const ITEM_LIST_API = "/api/item/list";
export const ORDER_API = "/api/order";
export const ORDER_LIST_API = "/api/order/list";
export const PAY_API = "/api/pay";
export const STORE_API = "/api/store";
export const STORE_LIST_API = "/api/store/list";
export const USER_API = "/api/user";
export const USER_LIST_API = "/api/user/list";
// UI attributes
export const BARCODE_PLACEHOLDER = "...barcode";
export const ID_PLACEHOLDER = "...id";
export const EMPTY_PLACEHOLDER = "";
export const TITLE_TEXT = "ScanAndGo";
// Default values
export const DEFAULT_INPUT_TYPE = "text";
export const DEFAULT_WELCOME_MSG = "hello";
export const DEFAULT_USERNAME = "commander";
export const PRICE_FRACTION_DIGITS = 2;
export const PLACES_RADIUS_METERS = "5000";
export const PLACES_TYPES = ["restaurant"];
// Test variables
export const TEST_STORE_ID = "WPANCUD-1";
export const TEST_STORE_MERCHANT_ID = "WPANCUD";
