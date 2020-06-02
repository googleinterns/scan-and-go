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
