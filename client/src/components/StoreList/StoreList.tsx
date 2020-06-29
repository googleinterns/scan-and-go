import React from "react";
import { useHistory } from "react-router-dom";
import { Store } from "src/interfaces";
import StoreCard from "src/components/StoreCard";
import { SCANSTORE_PAGE } from "src/constants";

function StoreList({ stores }: { stores: Store[] }) {
  const history = useHistory();

  const enterStore = (url: string) => {
    history.push({
      pathname: SCANSTORE_PAGE,
      search: url,
      state: {
        stores: stores,
      },
    });
  };

  return (
    <div className="StoreList">
      {stores &&
        stores.map((store) => (
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
