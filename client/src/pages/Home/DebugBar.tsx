import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import TextInputField from "src/components/TextInputField";
import StoreList from "src/components/StoreList";
import { fetchJson, extractIdentityToken } from "src/utils";
import { microapps, google, isWeb } from "src/config";
import {
  Store,
  emptyStore,
  MediaResponse,
  emptyMediaResponse,
  IdentityToken,
  emptyIdentityToken,
  GMapPlace,
} from "src/interfaces";
import {
  TEST_STORE_ID,
  TEST_STORE_MERCHANT_ID,
  SCANSTORE_PAGE,
  STORE_LIST_API,
  PLACES_RADIUS_METERS,
  PLACES_TYPES,
  GEO_PRECISION_DIGITS,
} from "src/constants";
import { BrowserMultiFormatReader } from "@zxing/library";
import SampleStoreQR from "src/img/Sample_StoreQR.png";
declare const window: any;

function DebugBar({
  storesCallback,
}: {
  storesCallback: (stores: Store[]) => void;
}) {
  const history = useHistory();

  const [userCoords, setUserCoords] = useState<[number, number]>([0.0, 0.0]);
  const [identity, setIdentity] = useState<IdentityToken>(emptyIdentityToken());
  const [nearbyPlaces, setNearbyPlaces] = useState<GMapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadImg, setUploadImg] = useState<MediaResponse>(
    emptyMediaResponse()
  );

  const debugImgId = "sampleStoreQRImgSrc";
  const uploadImgId = "storeQRImgSrc";

  // Dummy map attachment
  const map = new google.maps.Map(document.getElementById("mapPlaceholder"));
  // Declare our Google Map/Places API service handler
  const service = new google.maps.places.PlacesService(map);

  // Error callback for location API call
  const errorbackLoc = (error: any) => {
    alert(error);
  };

  // Grab the location of device
  const grabLoc = () => {
    // Use browser navigator if we are in web environment & available
    if (isWeb) {
      if (navigator.geolocation) {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(fetchStores, errorbackLoc);
      }
    } else {
      setIsLoading(true);
      microapps
        .getCurrentLocation()
        .then((loc: any) => {
          const position = {
            coords: {
              latitude: loc["latitude"],
              longitude: loc["longitude"],
            },
          };
          fetchStores(position);
        })
        .catch((err: any) => errorbackLoc(err));
    }
  };

  // fetch list of users
  const fetchStores = async (position: {
    coords: {
      latitude: number;
      longitude: number;
    };
  }) => {
    // Update location
    const data = {
      distance: 10000,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    const stores = await fetchJson("POST", data, STORE_LIST_API);
    setUserCoords([position.coords.latitude, position.coords.longitude]);
    storesCallback(stores);
    setIsLoading(false);
  };

  // Request PlacesAPI for nearby locations
  const getNearbyPlaces = () => {
    const curLoc = new google.maps.LatLng(userCoords[0], userCoords[1]);
    const request = {
      location: curLoc,
      radius: PLACES_RADIUS_METERS,
      type: PLACES_TYPES,
    };
    setIsLoading(true);
    service.nearbySearch(request, getNearbyPlacesCallback);
  };

  // Digest PlacesAPI results
  const getNearbyPlacesCallback = (places: any, status: any) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      setNearbyPlaces(places);
    } else {
      alert("PlacesAPI failure to return");
    }
    setIsLoading(false);
  };

  // Get user identity details
  const loginUser = async () => {
    // Only run in iframe (on app)
    if (!isWeb) {
      const request = { nonce: "Don't Hack me please" };
      microapps.getIdentity(request).then((response: any) => {
        setIdentity(extractIdentityToken(response));
      });
    }
  };

  // Scan Store's QR code
  const storeQR = async () => {
    if (isWeb) {
      const img = document.getElementById(debugImgId) as HTMLImageElement;
      processImageBarcode(img);
    } else {
      const imgReq = {
        allowedMimeTypes: ["image/jpeg"],
        allowedSources: ["camera"], // Restrict to camera scanning only
      };
      const imgRes = await window.microapps.requestMedia(imgReq);
      setUploadImg(imgRes);
    }
  };

  const processImageBarcode = async (img: HTMLImageElement) => {
    const codeReader = new BrowserMultiFormatReader();
    if (img) {
      const result = await codeReader
        .decodeFromImage(img)
        .then((res: any) => res.text);
      if (result) {
        history.push(SCANSTORE_PAGE + "?" + result);
      } else {
        //TODO(#65) Render failure message
      }
    }
  };

  useEffect(() => {
    if (uploadImg.mimeType) {
      const img = document.getElementById(uploadImgId) as HTMLImageElement;
      processImageBarcode(img);
    }
  }, [uploadImg]);

  return (
    <div className="DebugBar">
      {uploadImg.mimeType && (
        <img
          hidden={true}
          id={uploadImgId}
          src={"data:" + uploadImg.mimeType + ";base64," + uploadImg.bytes}
        />
      )}
      <img hidden={true} id={debugImgId} src={SampleStoreQR} />
      <button>
        <a href={`/store?id=${TEST_STORE_ID}&mid=${TEST_STORE_MERCHANT_ID}`}>
          Test Store
        </a>
      </button>
      <button onClick={loginUser}>User Login</button>
      <button onClick={storeQR}>Scan Store QR</button>
      <button onClick={grabLoc}>Nearby Stores</button>
      <button onClick={getNearbyPlaces}>Nearby Restaurants</button>
      <h3 style={{ color: "#ABABAB" }}>
        [{userCoords[0].toFixed(GEO_PRECISION_DIGITS)},
        {userCoords[1].toFixed(GEO_PRECISION_DIGITS)}] | {identity.sub} [
        {isLoading ? "Loading..." : ""}]
      </h3>
    </div>
  );
}

export default DebugBar;
