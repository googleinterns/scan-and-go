import React from "react";
import { useHistory } from "react-router-dom";
import { Store } from "src/interfaces";
import { Container, Divider } from "@material-ui/core";
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
    <Container disableGutters={true} className="StoreList">
      <div>
        {stores &&
          stores.map((store) => (
            <StoreCard
              key={store["store-id"]}
              redirect={enterStore}
              store={store}
            />
          ))}
      </div>
    </Container>
  );
}

export default StoreList;
