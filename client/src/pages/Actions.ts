import {
  STORE_API,
  STORE_LIST_API,
  USER_API,
  ITEM_API,
  DEFAULT_STORE_RADIUS,
  PLACES_RADIUS_METERS,
  PLACES_TYPES,
  GOOGLE_MAP_PLACEHOLDER_ID,
  GOOGLE_PLACES_SCRIPT_ID,
  ORDER_LIST_API,
  SCANSTORE_PAGE,
  ORDER_API,
  DEFAULT_CURRENCY_CODE,
  PRICE_FRACTION_DIGITS,
  TEST_ORDER_ID,
  TEST_PAYMENT_ID,
  MICROAPPS_ORDER_UPDATE_API,
  ORDER_ADD_API,
  TEST_ORDER_NAME,
} from "src/constants";
import {
  fetchJson,
  extractIdentityToken,
  getTotalPrice,
  fetchText,
  parseOrderName,
} from "src/utils";
import { isWeb, google, microapps } from "src/config";
import {
  IdentityToken,
  GeoLocation,
  emptyGeoLocation,
  emptyUser,
  CartItem,
  Store,
  OrderItem,
  Item,
  emptyCartItem,
} from "src/interfaces";

// Load up Google Maps Places API Service
let map: any;
let service: any;

const loadGooglePlacesService = () => {
  map = new google.maps.Map(document.getElementById(GOOGLE_MAP_PLACEHOLDER_ID));
  service = new google.maps.places.PlacesService(map);
};

// Depending on when Actions.ts is loaded, we may not have retrieved
// google Places API Script yet. If so, watch <script> for load prior to init
if (google) {
  loadGooglePlacesService();
} else {
  const googleScript = document.getElementById(GOOGLE_PLACES_SCRIPT_ID);
  if (googleScript) {
    googleScript.addEventListener("load", loadGooglePlacesService);
  }
}

export const getStoreInfo = async (storeId: string) => {
  const data = {
    "store-id": storeId,
  };
  return await fetchJson("POST", data, STORE_API);
};

export const getStoresByLocation = async (
  position: GeoLocation,
  distance?: number
) => {
  const data = {
    distance: DEFAULT_STORE_RADIUS,
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  return await fetchJson("POST", data, STORE_LIST_API);
};

export const getUserInfo = async (userId: string) => {
  const data = {
    "user-id": userId,
  };
  return await fetchJson("POST", data, USER_API);
};

export const getItem = async (
  barcode: string | null,
  merchantId: string | null
) => {
  if (!barcode || !merchantId) {
    return null;
  }
  const data = {
    "merchant-id": merchantId,
    barcode: [barcode],
  };
  const [item] = (await fetchJson("POST", data, ITEM_API)) || [];
  return item;
};

export const loginUser = async () => {
  if (isWeb) {
    return null;
  }
  // TODO (#149): implement more secure nonce
  // TODO (#163): synchronize login on microapp and web
  const request = { nonce: "Don't Hack me please" };
  return await microapps
    .getIdentity(request)
    .then((res: any) => extractIdentityToken(res));
};

export const getGeoLocation = (
  successCallback: (position: GeoLocation) => void,
  errorCallback?: (error: any) => void
) => {
  if (isWeb) {
    // Use browser navigator
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback ? errorCallback : () => {}
      );
    }
  } else {
    // Use microapps API
    microapps
      .getCurrentLocation()
      .then((loc: any) => Object.assign(emptyGeoLocation(), { coords: loc }))
      .then((pos: GeoLocation) => successCallback(pos))
      .catch((err: any) => (errorCallback ? errorCallback(err) : null));
  }
};

export const getNearbyPlacesTest = (
  position: GeoLocation,
  successCallback: (places: any, status: any) => void
) => {
  const curLoc = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
  const request = {
    location: curLoc,
    radius: PLACES_RADIUS_METERS,
    type: PLACES_TYPES,
  };
  service.nearbySearch(request, successCallback);
};

export const getOrders = async () => {
  return (await fetchJson("GET", {}, ORDER_LIST_API, true)) || [];
};

/**
 * Retrieves the list of items in an order.
 *
 * @param {string} orderName - The Spot order name in the form of {merchants/*\/orders/*}.
 * @returns {CartItem[]} contents - The items in the order.
 */
export const getOrderContents = async (orderName: string) => {
  let contents: CartItem[] = [];

  // retrieve order items from backend
  const order = await fetchJson("GET", {}, `${ORDER_API}/${orderName}`, true);
  if (order?.items) {
    const itemBarcodes = order.items.map(
      (orderItem: OrderItem) => orderItem.subtitle
    );
    const { merchantId } = parseOrderName(orderName);
    const data = {
      "merchant-id": merchantId,
      barcode: itemBarcodes,
    };
    const items = await fetchJson("POST", data, ITEM_API);
    contents = order.items.map((orderItem: OrderItem) => {
      return {
        item: items.find((item: Item) => item.barcode == orderItem.subtitle),
        quantity: orderItem.quantity,
      };
    });
  }
  return contents;
};

/**
 * Creates an order in the Spot database.
 * Returns the Spot Order response if successful.
 *
 * @param {Store} store - The store at which the order is made.
 * @param {CartItem[]} cartItems - The list of items in the order.
 */
export const createOrder = async (store: Store, cartItems: CartItem[]) => {
  if (isWeb) {
    return { name: TEST_ORDER_NAME, orderId: TEST_ORDER_ID }; // placeholder order for web flow
  }
  // TODO (#191): add currency code in items and price utility functions
  const currencyCode = DEFAULT_CURRENCY_CODE;
  const orderReq = {
    title: `Order @ ${store.name}`,
    items: cartItems.map((cartItem) => ({
      title: cartItem.item.name,
      subtitle: cartItem.item.barcode,
      quantity: cartItem.quantity,
      price: {
        currency: currencyCode,
        value: cartItem.item.price.toFixed(PRICE_FRACTION_DIGITS),
      },
    })),
    total: {
      currency: currencyCode,
      value: getTotalPrice(cartItems),
    },
    status: { type: "COMPLETED" },
  };

  let order = await microapps
    .createOrder(orderReq)
    .then((response: string) => JSON.parse(response));
  if (order) {
    // update the order actions for the newly created microapps order
    order = await fetchJson(
      "POST",
      { orderName: order.name },
      MICROAPPS_ORDER_UPDATE_API,
      true
    );

    // add the order to the ScanAndGo database
    const { merchantId } = parseOrderName(order.name);
    const data = {
      merchantId: merchantId,
      orderId: order.orderId,
    };
    await fetchText("POST", data, ORDER_ADD_API, true);
  }
  return order;
};

export const getUser = () => {
  const user = window.localStorage.getItem("user");
  if (user) {
    return JSON.parse(user);
  } else {
    return emptyUser;
  }
};

export const getStoreRedirectUrl = (storeId: string, merchantId: string) => {
  return `${SCANSTORE_PAGE}?id=${storeId}&mid=${merchantId}`;
};
