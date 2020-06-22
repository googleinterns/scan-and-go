import React from "react";
import { useHistory } from "react-router-dom";
import { Store } from "src/interfaces";
import { DEFAULT_BACK_BTN_TEXT } from "src/constants";

function StoreHeader({
  store,
  link,
  linkText,
}: {
  store: Store | null;
  link?: string | null;
  linkText?: string | null;
}) {
  const history = useHistory();

  const headerLink = () => {
    if (link) {
      history.push(link);
    }
  };

  return (
    <div className="StoreHeader">
      {link && (
        <button id="back" onClick={headerLink}>
          {linkText ? linkText : DEFAULT_BACK_BTN_TEXT}
        </button>
      )}
      {store && (
        <h3>
          [{store.latitude},{store.longitude}]
        </h3>
      )}
      {store && store["store-id"] && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            <tr key={store["store-id"]}>
              <td>{store["store-id"]}</td>
              <td>{store.name}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StoreHeader;
