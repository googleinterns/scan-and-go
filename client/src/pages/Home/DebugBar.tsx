import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { google, isWeb } from "src/config";
import {
  Store,
  MediaResponse,
  emptyMediaResponse,
  IdentityToken,
  emptyIdentityToken,
  GMapPlace,
  GeoLocation,
} from "src/interfaces";
import {
  TEST_STORE_ID,
  TEST_STORE_MERCHANT_ID,
  SCANSTORE_PAGE,
  GEO_PRECISION_DIGITS,
} from "src/constants";
import {
  getGeoLocation,
  getStoresByLocation,
  loginUser,
  getNearbyPlacesTest,
  getStoreRedirectUrl,
} from "src/pages/Actions";
import { BrowserMultiFormatReader } from "@zxing/library";
import SampleStoreQR from "src/img/Sample_StoreQR.png";
declare const window: any;

function DebugBar({
  storesCallback,
  placesCallback,
}: {
  storesCallback: (stores: Store[]) => void;
  placesCallback?: (stores: GMapPlace[]) => void;
}) {
  const history = useHistory();

  const [curGeoLocation, setCurGeoLocation] = useState<GeoLocation | null>(
    null
  );
  const [identity, setIdentity] = useState<IdentityToken>(emptyIdentityToken());
  const [isLoading, setIsLoading] = useState(false);
  const [uploadImg, setUploadImg] = useState<MediaResponse>(
    emptyMediaResponse()
  );

  const debugImgId = "sampleStoreQRImgSrc";
  const uploadImgId = "storeQRImgSrc";

  // Grab the location of device
  const grabLoc = () => {
    setIsLoading(true);
    getGeoLocation(geoLocationCallback);
  };

  const geoLocationCallback = (position: GeoLocation) => {
    setIsLoading(false);
    setCurGeoLocation(position);
  };

  const fetchStores = async (position?: GeoLocation) => {
    // When called without arguments, we default to using
    // already present location previously retrieved
    if (!position) {
      if (curGeoLocation) {
        position = curGeoLocation;
      } else {
        return;
      }
    }
    getStoresByLocation(position).then((res: any) => storesCallback(res));
  };

  // Request PlacesAPI for nearby locations
  const getNearbyPlaces = () => {
    if (curGeoLocation) {
      setIsLoading(true);
      getNearbyPlacesTest(curGeoLocation, getNearbyPlacesCallback);
    }
  };

  // Digest PlacesAPI results
  const getNearbyPlacesCallback = (places: any, status: any) => {
    setIsLoading(false);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (placesCallback) {
        placesCallback(places);
      }
    }
  };

  // Get user identity details
  const testLogin = async () => {
    loginUser().then((userToken: IdentityToken | null) => {
      if (userToken) {
        setIdentity(userToken);
      }
    });
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
    fetchStores();
  }, [curGeoLocation]);

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
        <a href={getStoreRedirectUrl(TEST_STORE_ID, TEST_STORE_MERCHANT_ID)}>
          Test Store
        </a>
      </button>
      <button onClick={testLogin}>User Login</button>
      <button onClick={storeQR}>Scan Store QR</button>
      <button onClick={grabLoc}>Update Location</button>
      <button onClick={() => fetchStores()}>Nearby Stores</button>
      <button onClick={getNearbyPlaces}>Nearby Restaurants</button>
      <h3 style={{ color: "#ABABAB" }}>
        [
        {curGeoLocation
          ? curGeoLocation.coords.latitude.toFixed(GEO_PRECISION_DIGITS)
          : "---"}
        ,
        {curGeoLocation
          ? curGeoLocation.coords.longitude.toFixed(GEO_PRECISION_DIGITS)
          : "---"}
        ] | {identity.sub} [{isLoading ? "Loading..." : ""}]
      </h3>
    </div>
  );
}

export default DebugBar;
