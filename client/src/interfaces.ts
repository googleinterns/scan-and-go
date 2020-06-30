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
  media?: string; // Image display string
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
  latitude: number; // Geolocation information
  longitude: number; // ''
  distance?: number; //TODO(#115): Refactor out UI-only fields to keep consistency with DB
  media?: string; // Image/Icon displayed
  business_status?: string; // State of store opening
  vicinity?: string; // Address of store
}

export const emptyStore = (): Store => ({
  "store-id": "",
  "merchant-id": "",
  name: "",
  latitude: 0.0,
  longitude: 0.0,
});

// This is supposedly what is returned to us from microapps.getIdentity()
export interface IdentityToken {
  iss: string; // Issuer identifier (accounts.google.com)
  sub: string; // Unique identifier tied to Google account
  name: string; // User's displayed name
  aud: string; // Audience: OAuth2.0 client ID of our GCP Project
  iat: number; // Token validity start time
  exp: number; // Token validity expiry time
}

export const emptyIdentityToken = (): IdentityToken => ({
  iss: "",
  sub: "EMPTY",
  name: "",
  aud: "",
  iat: -1,
  exp: 0,
});

export interface User {
  name: string;
  "user-id": string;
}

export const emptyUser = (): User => ({
  name: "",
  "user-id": "",
});

// results json response from PlacesAPI call using PlacesService:
// https://developers.google.com/maps/documentation/javascript/reference/places-service#PlaceResult
export interface GMapPlace {
  business_status: string; // Whether business is open
  geometry: {
    // Encodes location information for map display
    location: {
      lat: () => number; // Note: These are functions!
      lng: () => number; // we are wrapping around a PlaceResult object
    };
  };
  photos: [
    {
      getUrl: (params?: any) => string;
    }
  ];
  icon: string; // URL link to image for display
  id: string; //TODO: appears to be an internal id we may not need
  name: string; // Displayed name
  place_id: string; // unique place_id for this entity we can use
  vicinity: string; // address field
}

// Response from microapps.requestMedia() API call
export interface MediaResponse {
  bytes: string; // Image data in bytes
  mimeType: string; // Type of image
}

export const emptyMediaResponse = (): MediaResponse => ({
  bytes: "",
  mimeType: "",
});

// Declare interface for navigator.geolocation result
export interface GeoLocation {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export const emptyGeoLocation = (): GeoLocation => ({
  coords: {
    latitude: 0.0,
    longitude: 0.0,
  },
});
