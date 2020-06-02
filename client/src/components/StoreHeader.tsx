import React, { useEffect, useState } from "react";
import { Store, emptyStore } from "./../interfaces";
import { fetchJson } from "./../utils";

function StoreHeader() {
  // Update the current store we're in
  const [curStore, setCurStore] = useState<Store>(emptyStore());
  // Update URL params
  const curUrl = window.location.search;
  const urlParams = new URLSearchParams(curUrl);

  // fetch list of users
  const fetchStore = async () => {
    let data = {
      "store-id": urlParams.get("id"),
    };
    const stores = fetchJson(data, "/api/store", fetchStoreCallback);
  };

  const fetchStoreCallback = (stores: any) => {
    setCurStore(stores);
  };

  useEffect(() => {
    fetchStore();
  }, []);

  class LocationTrack extends React.Component {
    constructor(props: any) {
      super(props);
    }
    render() {
      return (
        <h3>
          [{curStore.latitude},{curStore.longitude}]
        </h3>
      );
    }
  }

  // Html DOM element returned
  return (
    <div className="StoreHeader">
      <LocationTrack />
      {curStore["store-id"] && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr key={curStore["store-id"]}>
              <td>{curStore["store-id"]}</td>
              <td>{curStore.name}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StoreHeader;
