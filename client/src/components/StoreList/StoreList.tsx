import React from "react";
import { useHistory } from "react-router-dom";
import { Store } from "src/interfaces";
import StoreCard from "src/components/StoreCard";
import StorePlaceholder from "src/components/StorePlaceholder";
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
        stores.map((store: Store | null, i: number) => (
          <StoreCard
            key={store ? store["store-id"] : `store-${i}`}
            redirect={enterStore}
            store={store}
          />
        ))}
    </div>
  );
}

export default StoreList;
