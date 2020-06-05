import React, { useEffect, useState } from "react";
import { Store, emptyStore } from "./../interfaces";
import { fetchJson } from "./../utils";

function StoreHeader(props: any) {
  // Update the current store we're in
  const [curStore, setCurStore] = useState<Store>(emptyStore());
  // Update URL params
  const store_id = props.store_id;

  // fetch list of users
  const fetchStore = async () => {
    let data = {
      "store-id": store_id,
    };
    const stores = fetchJson(data, "/api/store", fetchStoreCallback);
  };

  const fetchStoreCallback = (stores: any) => {
    setCurStore(stores);
  };

  useEffect(() => {
    fetchStore();
  }, []);

  // Html DOM element returned
  return (
    <div className="StoreHeader">
      <a href="/">back</a>
      <h3>
        [{curStore.latitude},{curStore.longitude}]
      </h3>
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
