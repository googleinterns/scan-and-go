export interface Item {
  barcode: string;
  name: string;
  price: number;
  "merchant-id": string;
}

export const emptyItem = (): Item => ({
  barcode: "",
  name: "",
  price: 0.0,
  "merchant-id": "",
});

export interface CartItem {
  item: Item;
  quantity: number;
}

export const emptyCartItem = (): CartItem => ({
  item: emptyItem(),
  quantity: 0,
});

export interface Store {
  "store-id": string;
  name: string;
  distance: number;
  latitude: number;
  longitude: number;
}

export const emptyStore = (): Store => ({
  "store-id": "",
  name: "",
  distance: 0.0,
  latitude: 0.0,
  longitude: 0.0,
});

export interface IdentityToken {
  iss: string;
  sub: string;
  aud: string;
  iat: number;
  exp: number;
}

export const emptyIdentityToken = (): IdentityToken => ({
  iss: "",
  sub: "EMPTY",
  aud: "",
  iat: -1,
  exp: 0,
});

export interface GMapPlace {
  business_status: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  icon: string;
  id: string;
  name: string;
  place_id: string;
  vicinity: string;
}
