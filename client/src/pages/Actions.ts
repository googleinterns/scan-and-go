import { STORE_API, USER_API } from "src/constants";
import { fetchJson, extractIdentityToken } from "src/utils";
import { isWeb, microapps } from "src/config";
import { IdentityToken } from "src/interfaces";

export const getStoreInfo = async (storeId: string) => {
  const data = {
    "store-id": storeId,
  };
  return await fetchJson("POST", data, STORE_API);
};

export const getUserInfo = async (userId: string) => {
  const data = {
    "user-id": userId,
  };
  return await fetchJson("POST", data, USER_API);
};

export const loginUser = (): IdentityToken | null => {
  if (isWeb) {
    return null;
  }
  const request = { nonce: "Don't Hack me please" };
  const identityToken = microapps
    .getIdentity(request)
    .then((res: any) => extractIdentityToken(res))
    .catch((err: any) => {
      return null;
    });
  return identityToken;
};
