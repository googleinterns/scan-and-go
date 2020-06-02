import React, { useEffect, useState } from "react";
import { Store } from "./../interfaces";
import { fetchJson } from "./../utils";
//const microapps = require('./../microapps.js')

function StoreList() {
  // Current Location (from API call)
  const [userCoords, setUserCoords] = useState<[number, number]>([0.0, 0.0]);
  // List of stores (from Database)
  const [storeList, setStoreList] = useState<Store[]>([]);

  function grabLoc() {
    /*if (window.location !== window.parent.location){
      microapps.getCurrentLocation().then((loc:any) => {
        setUserCoords([loc['latitude'],loc['longitude']])
      })
    }*/
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(callbackLoc, errorbackLoc);
    }
  }

  function callbackLoc(position: any) {
    setUserCoords([position.coords.latitude, position.coords.longitude]);
  }

  function errorbackLoc(error: any) {
    alert(error);
  }

  // fetch user location
  grabLoc();

  // fetch list of users
  const fetchStores = async () => {
    // Update location
    grabLoc(); //blocking? race on userCoords update?
    let data = {
      distance: 10000,
      latitude: userCoords[0],
      longitude: userCoords[1],
    };
    fetchJson(data, "/api/stores", fetchStoresCallback);
  };

  const fetchStoresCallback = (stores: any) => {
    setStoreList(stores);
  };

  function LocationTrack(props: any) {
    return (
      <h3>
        [{userCoords[0]},{userCoords[1]}]
      </h3>
    );
  }

  // Html DOM element returned
  return (
    <div className="StoreList">
      <LocationTrack />
      <button>
        <a href="/store?id=WPANCUD-1">Test Store</a>
      </button>
      <button onClick={fetchStores}>Lookup Stores</button>
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
                  <a href={"/store?id=" + store["store-id"]}>{store.name}</a>
                </td>
                <td>{store.distance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StoreList;
