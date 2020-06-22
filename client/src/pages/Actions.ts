import { STORE_API } from "src/constants";
import { fetchJson } from "src/utils";
import { Store } from "src/interfaces";

export const getStoreInfo = async (storeId: string) => {
  const data = {
    "store-id": storeId,
  };
  return await fetchJson("POST", data, STORE_API);
};
