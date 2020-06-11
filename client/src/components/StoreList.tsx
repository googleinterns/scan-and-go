import React, { useEffect, useState } from "react";
import {
  Store,
  IdentityToken,
  emptyIdentityToken,
  GMapPlace,
} from "./../interfaces";
import { fetchJson } from "./../utils";
import Divider from "@material-ui/core/Divider";

// Applease typescript
declare const window: any;
// Grab handle to our microapps js library
const microapps = window.microapps;
// Grab handle to google client js API
const google = window.google;

function StoreList() {
  const [userCoords, setUserCoords] = useState<[number, number]>([0.0, 0.0]);
  const [storeList, setStoreList] = useState<Store[]>([]);
  const [identity, setIdentity] = useState<IdentityToken>(emptyIdentityToken);
  const [nearbyPlaces, setNearbyPlaces] = useState<GMapPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    // Use microapps API if we are in an iframe
    if (window.location !== window.parent.location) {
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
    // Otherwise, use browser navigator
    else if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(fetchStores, errorbackLoc);
    }
  };

  // fetch list of users
  const fetchStores = async (position: {
    coords: {
      latitude: number,
      longitude: number,
    },
  }) => {
    // Update location
    grabLoc(); //blocking? race on userCoords update?
    const data = {
      distance: 10000,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    const stores = await fetchJson(data, "/api/stores");
    setStoreList(stores);
    setIsLoading(false);
  };

  // Request PlacesAPI for nearby locations
  const getNearbyPlaces = () => {
    const curLoc = new google.maps.LatLng(userCoords[0], userCoords[1]);
    const request = {
      location: curLoc,
      radius: "5000",
      type: ["restaurant"],
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
    if (window.location !== window.parent.location) {
      const request = { nonce: "Don't Hack me please" };
      microapps
        .getIdentity(request)
        .then((response: any) => {
          const decoded = JSON.parse(atob(response.split(".")[1]));
          setIdentity(decoded);
        })
        .catch((error: any) => {
          console.error("An error occurred: ", error);
        });
    } else {
      console.log("Only supported in GPay microapp");
    }
  };

  return (
    <div className="StoreList">
      <h3>
        [{userCoords[0]},{userCoords[1]}]
      </h3>
      <h4>
        {identity.sub} [{isLoading ? "Loading..." : ""}]
      </h4>
      <button>
        <a href="/store?id=WPANCUD-1">Test Store</a>
      </button>
      <button onClick={loginUser}>User Login</button>
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
