// Client Site Pages
export const HOME_PAGE = "/";
export const SCANSTORE_PAGE = "/store";
export const CHECKOUT_PAGE = "/checkout";
export const RECEIPT_PAGE = "/receipt";
export const LOGIN_PAGE = "/login";
// API endpoints
export const API = "/api/";
export const CART_API = "/api/cart";
export const ITEM_API = "/api/item";
export const ORDER_API = "/api/order";
export const ORDER_ADD_API = "/api/order/add";
export const ORDER_UPDATE_API = "/api/order/update";
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
// HTML DOM Handles
export const GOOGLE_MAP_PLACEHOLDER_ID = "mapPlaceholder";
export const GOOGLE_PLACES_SCRIPT_ID = "mapPlacesAPIScript";
// Default values
export const DEFAULT_INPUT_TYPE = "text";
export const DEFAULT_WELCOME_MSG = "hello";
export const DEFAULT_USERNAME = "commander";
export const DEFAULT_USER_HEADER_SUBTITLE =
  "Shop at your favorite stores with Google Pay";
export const DEFAULT_CART_HEADER_TITLE = "My Cart";
export const DEFAULT_STORE_HEADER_SUBTITLE = "Currently Shopping @";
export const DEFAULT_BACK_BTN_TEXT = "back";
export const DEFAULT_ALERT_DURATION = 3000;
export const PRICE_FRACTION_DIGITS = 2;
export const GEO_PRECISION_DIGITS = 3;
export const PLACES_RADIUS_METERS = "5000";
export const PLACES_TYPES = ["restaurant"];
export const DEFAULT_STORE_RADIUS = 10000;
export const PLACEHOLDER_ITEM_MEDIA = "http://placekitten.com/200/200";
export const PLACEHOLDER_STORE_MEDIA = "http://placekitten.com/300/300";
export const DEFAULT_CURRENCY_CODE = "INR";
// Test variables
export const TEST_ORDER_ID = "TEST ORDER";
export const TEST_ORDER_NAME = "merchants/TEST MERCHANT/orders/TEST ORDER";
export const TEST_STORE_ID = "WPANCUD-1";
export const TEST_STORE_MERCHANT_ID = "WPANCUD";
export const TEST_USER = { name: "TEST USER", "user-id": "TEST USER ID" };
export const TEST_PAYMENT_ID = "TEST PAYMENT";
// Enums
export enum DAY_PERIOD {
  MORNING = "Morning",
  NOON = "Noon",
  AFTERNOON = "Afternoon",
  EVENING = "Evening",
  NIGHT = "Night",
}
export enum PAYMENT_STATUS {
  AWAITING = "AWAITING", // awaiting payment, not yet initiated
  SUBMITTED = "SUBMITTED", // pending transaction
  SUCCESS = "SUCCESS", // completed transaction
  FAILURE = "FAILURE",
}
// Reducer actions
export const SET_USER = "setUser";
export const UNSET_USER = "unsetUser";
