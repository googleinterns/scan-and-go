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
  ITEM_LIST_API,
  ORDER_API,
  DEFAULT_CURRENCY_CODE,
  PRICE_FRACTION_DIGITS,
  TEST_ORDER_ID,
  TEST_PAYMENT_ID,
} from "src/constants";
import { fetchJson, extractIdentityToken, getTotalPrice } from "src/utils";
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
    barcode: barcode,
  };
  return await fetchJson("POST", data, ITEM_API);
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
 * @param {string} orderName - The order name in the form of {merchants/*\/orders/*}.
 * @returns {CartItem[]} contents - The items in the order.
 */
export const getOrderContents = async (orderName: string) => {
  // parse merchant ID from order name
  let merchantId = "";
  const matches = orderName.match(/(?<=merchants\/)(.*?)(?=\/orders)/gi);
  if (matches) {
    merchantId = matches[0];
  }

  // retrieve order items
  const order = await fetchJson("GET", {}, `${ORDER_API}/${orderName}`, true);
  let contents: CartItem[] = [];
  if (order) {
    const itemBarcodes = order.items.map(
      (orderItem: OrderItem) => orderItem.subtitle
    );
    const data = {
      "merchant-id": merchantId,
      barcode: itemBarcodes,
    };
    const items = await fetchJson("POST", data, ITEM_LIST_API);
    contents = order.items.map((orderItem: OrderItem) => {
      return {
        item: items.filter((item: Item) => item.barcode == orderItem.subtitle),
        quantity: orderItem.quantity,
      };
    });
  }
  return contents;
};

/**
 * Creates an order in the Spot database.
 *
 * @param {Store} store - The store at which the order is made.
 * @param {CartItem[]} cartItems - The list of items in the order.
 */
export const createOrder = async (store: Store, cartItems: CartItem[]) => {
  // TODO (#): handle currency code in items and price utility functions
  const currencyCode = DEFAULT_CURRENCY_CODE;
  const order = {
    title: `Order @ ${store.name}`,
    items: cartItems.map((cartItem) => {
      return {
        title: cartItem.item.name,
        subtitle: cartItem.item.barcode,
        quantity: cartItem.quantity,
        price: {
          currency: currencyCode,
          value: cartItem.item.price.toFixed(PRICE_FRACTION_DIGITS),
        },
      };
    }),
    total: {
      currency: currencyCode,
      value: getTotalPrice(cartItems),
    },
    status: { type: "COMPLETED" },
    payments: [
      {
        id: "ac6d65fa-e427-47c7-8631-21bd976b09c6",
      },
    ], // must be set for server-side
  };
  const body = {
    order: order,
    merchantId: process.env.REACT_APP_SPOT_MERCHANT_ID,
  };
  // return await microapps.createOrder(order);
  return await fetchJson("POST", body, ORDER_API, true);
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
