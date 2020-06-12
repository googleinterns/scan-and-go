import React, { useEffect, useState } from "react";
import { Store, emptyStore } from "./../interfaces";
import { fetchJson } from "./../utils";

function StoreHeader({ storeId }: { storeId: string | null }) {
  const [curStore, setCurStore] = useState<Store>(emptyStore);

  // fetch list of users
  const fetchStore = async () => {
    let data = {
      "store-id": storeId,
    };
    const stores = await fetchJson(data, "/api/store")
    setCurStore(stores);
  };

  useEffect(() => {
    fetchStore();
  }, []);

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
