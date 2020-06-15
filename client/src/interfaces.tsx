/*
 * interfaces.tsx
 *
 * This file declares typescript interfaces to match
 * database documents as well as API json responses.
 *
 */

export interface Item {
  barcode: string; // SKU identifier
  name: string; // Displayed product name
  price: number; // Price in dollars decimal
  "merchant-id": string; // Which merchant owns this item
}

export const emptyItem = (): Item => ({
  barcode: "",
  name: "",
  price: 0.0,
  "merchant-id": "",
});

// CartItem describes an Item in user's Cart
export interface CartItem {
  item: Item;
  quantity: number; // Number of Items added to Cart
}

export const emptyCartItem = (): CartItem => ({
  item: emptyItem(),
  quantity: 0,
});

export interface Store {
  "store-id": string; // Unique store-id -> Can match GMaps place_id
  "merchant-id": string; // Merchant this store belongs to (for payment info)
  name: string; // Displayed name
  distance: number; //TODO: Refactor this field out to keep consistency with DB
  latitude: number; // Geolocation information
  longitude: number; // ''
}

export const emptyStore = (): Store => ({
  "store-id": "",
  "merchant-id": "",
  name: "",
  distance: 0.0,
  latitude: 0.0,
  longitude: 0.0,
});

// This is supposedly what is returned to us from microapps.getIdentity()
export interface IdentityToken {
  iss: string; // Issuer identifier (accounts.google.com)
  sub: string; // Unique identifier tied to Google account
  aud: string; // Audience: OAuth2.0 client ID of our GCP Project
  iat: number; // Token validity start time
  exp: number; // Token validity expiry time
}

export const emptyIdentityToken = (): IdentityToken => ({
  iss: "",
  sub: "EMPTY",
  aud: "",
  iat: -1,
  exp: 0,
});

// results json response from PlacesAPI call:
// https://developers.google.com/places/web-service/search#PlaceSearchResults
export interface GMapPlace {
  business_status: string; // Whether business is open
  geometry: {
    // Encodes location information for map display
    location: {
      lat: number;
      lng: number;
    };
  };
  icon: string; // URL link to image for display
  id: string; //TODO: appears to be an internal id we may not need
  name: string; // Displayed name
  place_id: string; // unique place_id for this entity we can use
  vicinity: string; // address field
}

export interface MediaResponse {
  bytes: string;
  mimeType: string;
}

export const emptyMediaResponse = (): MediaResponse => ({
  bytes: "",
  mimeType: "",
});
