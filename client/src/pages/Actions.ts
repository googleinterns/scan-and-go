import {
  STORE_API,
  STORE_LIST_API,
  USER_API,
  DEFAULT_STORE_RADIUS,
  PLACES_RADIUS_METERS,
  PLACES_TYPES,
  GOOGLE_MAP_PLACEHOLDER_ID,
} from "src/constants";
import { fetchJson, extractIdentityToken } from "src/utils";
import { isWeb, google, microapps } from "src/config";
import { IdentityToken, GeoLocation, emptyGeoLocation } from "src/interfaces";

// Load up Google Maps Places API Service
const map = new google.maps.Map(
  document.getElementById(GOOGLE_MAP_PLACEHOLDER_ID)
);
const service = new google.maps.places.PlacesService(map);

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

export const loginUser = (): IdentityToken | null => {
  if (isWeb) {
    return null;
  }
  //TODO(#113) Server-side generated nonce?
  const request = { nonce: "Don't Hack me please" };
  const identityToken = microapps
    .getIdentity(request)
    .then((res: any) => extractIdentityToken(res))
    .catch((err: any) => {
      return null;
    });
  return identityToken;
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
