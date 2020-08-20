module.exports = {
  HTTP_SUCCESS: 200,
  HTTP_CREATE: 201,
  HTTP_UNAUTHORIZED: 401,
  HTTP_NOTFOUND: 404,
  HTTP_INTERNALERROR: 500,
  USERS_COLLECTION: "users",
  ITEMS_COLLECTION: "items",
  STORES_COLLECTION: "stores",
  ORDERS_COLLECTION: "orders",

  DEFAULT_SEARCH_RADIUS_METERS: 2000,
  FIRESTORE_MAX_NUM_CLAUSES: 10,

  SPOT_BASE_URL: "https://microapps.googleapis.com/v1alpha",
  SPOT_ORDERS_SCOPE: "https://www.googleapis.com/auth/microapps.orders",

  TEST_USER_ID: "93IRJIDF01LDKS0",
  TEST_ORDER_ID: "TEST_ORDER",
  TEST_MERCHANT_ID: "TEST_MERCHANT",
  TEST_STORE_ID: "TEST_STORE",
  TEST_ORDER_NAME: "merchants/TEST_MERCHANT/orders/TEST_ORDER",
};
