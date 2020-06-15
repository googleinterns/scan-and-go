export const isDebug = false;

export declare const window: any;

// Grab a handle to our microapps javascript library
export const microapps = window.microapps;

// Detect if our app is running from within an iframe
// if so, then we are *likely* in the microapps environment
// and will render as such.
export const isWeb = window.location == window.parent.location;

// API endpoints
export const API = "/api";
export const CART_API = "/api/cart";
export const ITEM_API = "/api/item";
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
// Default values
export const DEFAULT_INPUT_TYPE = "text";
export const DEFAULT_WELCOME_MSG = "hello";
export const DEFAULT_USERNAME = "commander";
export const PRICE_FRACTION_DIGITS = 2;
export const PLACES_RADIUS_METERS = "5000";
export const PLACES_TYPES = ["restaurant"];
// Test variables
export const TEST_STORE_ID = "WPANCUD";