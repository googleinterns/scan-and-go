import React, { useEffect, useState } from "react";
import {
  Store,
  IdentityToken,
  emptyIdentityToken,
  GMapPlace,
  MediaResponse,
  emptyMediaResponse,
} from "./../interfaces";
import { fetchJson, extractIdentityToken } from "./../utils";
import {
  STORE_LIST_API,
  PLACES_RADIUS_METERS,
  PLACES_TYPES,
  TEST_STORE_ID,
  TEST_STORE_MERCHANT_ID,
  microapps,
  google,
  isWeb,
  isDebug,
} from "../constants";
import Divider from "@material-ui/core/Divider";
import { BrowserMultiFormatReader } from "@zxing/library";
import SampleStoreQR from "./../img/Sample_StoreQR.png";
declare const window: any;

function StoreList() {
  const [userCoords, setUserCoords] = useState<[number, number]>([0.0, 0.0]);
  const [storeList, setStoreList] = useState<Store[]>([]);
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
    setStoreList(stores);
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
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      setNearbyPlaces(places);
    } else {
      alert("PlacesAPI failure to return");
    }
    setIsLoading(false);
  };

  // Get user identity details
  const loginUser = async () => {
    // Only run in iframe (on app)
    if (isWeb) {
      console.log("Only supported in GPay microapp");
    } else {
      const request = { nonce: "Don't Hack me please" };
      microapps
        .getIdentity(request)
        .then((response: any) => {
          setIdentity(extractIdentityToken(response));
        })
        .catch((error: any) => {
          console.error("An error occurred: ", error);
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
        .then((res: any) => res.text)
        .catch((err: any) => {
          console.error(err);
        });
      if (result) {
        window.location.href = "/store?" + result;
      } else {
        //TODO(#65) Render failure message
        if (isDebug) {
          console.log("Unable to redirect, QR Code not scanned correctly");
        }
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
    <div className="StoreList">
      {uploadImg.mimeType && (
        <img
          hidden={true}
          id={uploadImgId}
          src={"data:" + uploadImg.mimeType + ";base64," + uploadImg.bytes}
        />
      )}
      <img hidden={true} id={debugImgId} src={SampleStoreQR} />
      <h3>
        [{userCoords[0]},{userCoords[1]}]
      </h3>
      <h4>
        {identity.sub} [{isLoading ? "Loading..." : ""}]
      </h4>
      <button>
        <a href={`/store?id=${TEST_STORE_ID}&mid=${TEST_STORE_MERCHANT_ID}`}>
          Test Store
        </a>
      </button>
      <button onClick={loginUser}>User Login</button>
      <button onClick={storeQR}>Scan Store QR</button>
      <button onClick={grabLoc}>Nearby Stores</button>
      <button onClick={getNearbyPlaces}>Nearby Restaurants</button>
      {storeList.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            {storeList.map((store: Store) => (
              <tr key={store["store-id"]}>
                <td>{store["store-id"]}</td>
                <td>
                  <a
                    href={
                      "/store?id=" +
                      store["store-id"] +
                      "&mid=" +
                      store["merchant-id"]
                    }
                  >
                    {store.name}
                  </a>
                </td>
                <td>{store.distance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Divider />
      {nearbyPlaces.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {nearbyPlaces.map((place: GMapPlace) => (
              <tr key={place["place_id"]}>
                <td>{place["place_id"]}</td>
                <td>{place.name}</td>
                <td>{place.vicinity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StoreList;
