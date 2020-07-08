import React from "react";
import { useHistory } from "react-router-dom";
import { Store } from "src/interfaces";
import StoreCard from "src/components/StoreCard";

function StoreList({ stores }: { stores: Store[] }) {
  const history = useHistory();

  const enterStore = (url: string) => {
    const [urlPath, urlParams] = url.split("?");
    history.push({
      pathname: urlPath,
      search: urlParams,
      state: {
        stores: stores,
      },
    });
  };

  return (
    <div className="StoreList">
      {stores &&
        stores.map((store: Store) => (
          <StoreCard
            key={store["store-id"]}
            redirect={enterStore}
            store={store}
          />
        ))}
    </div>
  );
}

export default StoreList;
