// Mock any middlewares before creating the express server
// so that express stores a reference to the mocked module
// https://stackoverflow.com/questions/58831968/simple-way-to-test-middleware-in-express-without-creating-recreating-server/58834073#58834073
// https://stackoverflow.com/questions/41995464/how-to-mock-middleware-in-express-to-skip-authentication-for-unit-test
jest.mock("./../authentication", () => jest.fn());

const request = require("supertest");
const { app, server } = require("./../server");
const CONSTANTS = require("./../constants");
const TEST_USERS = require("./../data/users.json");
const TEST_ITEMS = require("./../data/items.json");
const TEST_STORES = require("./../data/stores.json");
const TEST_ORDERS = require("./../data/orders.json");
const {
  usersCollection,
  itemsCollection,
  storesCollection,
  ordersCollection,
} = require("./../firestore");
const { sortUsers, sortItems, sortStores, sortOrders } = require("./testUtils");
const { populate, clearDB } = require("./../emulatedFirestore.js");
const authenticateUser = require("./../authentication");

beforeEach(async () => {
  await populate();
});

afterEach(async () => {
  await clearDB();
});

afterAll(() => {
  server.close();
});

describe("Assert Mock Database Loaded", () => {
  it("Users database should match", async () => {
    const usersQuery = await usersCollection.get();
    const users = usersQuery.docs.map((doc) => doc.data());
    expect(users.sort(sortUsers)).toEqual(TEST_USERS.sort(sortUsers));
  });
  it("Items database should match", async () => {
    const itemsQuery = await itemsCollection.get();
    const items = itemsQuery.docs.map((doc) => doc.data());
    expect(items.sort(sortItems)).toEqual(TEST_ITEMS.sort(sortItems));
  });
  it("Stores database should match", async () => {
    const storesQuery = await storesCollection.get();
    const stores = storesQuery.docs.map((doc) => doc.data());
    expect(stores.sort(sortStores)).toEqual(TEST_STORES.sort(sortStores));
  });
  it("Orders database should match", async () => {
    const ordersQuery = await ordersCollection.get();
    const orders = ordersQuery.docs.map((doc) => doc.data());
    expect(orders.sort(sortOrders)).toEqual(TEST_ORDERS.sort(sortOrders));
  });
});

describe("API POST Data", () => {
  it("should get TEST_USER details", async () => {
    const testUser = TEST_USERS[0];
    const res = await request(app).post("/api/user").send({
      "user-id": testUser["user-id"],
    });
    expect(res.statusCode).toEqual(CONSTANTS.HTTP_SUCCESS);
    for (let field in testUser) {
      expect(res.body).toHaveProperty(field, testUser[field]);
    }
  });
  it("should get TEST_ITEM details", async () => {
    const testItem = TEST_ITEMS[0];
    const res = await request(app).post("/api/item").send({
      "merchant-id": testItem["merchant-id"],
      barcode: testItem["barcode"],
    });
    expect(res.statusCode).toEqual(CONSTANTS.HTTP_SUCCESS);
    for (let field in testItem) {
      expect(res.body).toHaveProperty(field, testItem[field]);
    }
  });
  it("should get TEST_STORE details", async () => {
    const testStore = TEST_STORES[0];
    const res = await request(app).post("/api/store").send({
      "store-id": testStore["store-id"],
    });
    expect(res.statusCode).toEqual(CONSTANTS.HTTP_SUCCESS);
    for (let field in testStore) {
      expect(res.body).toHaveProperty(field, testStore[field]);
    }
  });
  it("should display list of nearby stores", async () => {
    const testLoc = {
      latitude: 1.3591432,
      longitude: 103.8781964,
    };
    const res = await request(app).post("/api/store/list").send({
      distance: 10000,
      latitude: testLoc["latitude"],
      longitude: testLoc["longitude"],
    });
    expect(res.statusCode).toEqual(CONSTANTS.HTTP_SUCCESS);
    // We should have 2 stores within a 10km radius
    const expectedStores = ["WPANCUD-1", "WPANCUD-3"];
    expect(res.body).toHaveLength(expectedStores.length);
    expect(
      res.body.every((store) => expectedStores.includes(store["store-id"]))
    ).toBe(true);
  });
  it("should display stores in alphabetic order when without location", async () => {
    const testQueryLimit = 3;
    const res = await request(app).post("/api/store/list").send({
      queryLimit: testQueryLimit,
    });
    expect(res.statusCode).toEqual(CONSTANTS.HTTP_SUCCESS);
    const expectedStores = TEST_STORES.sort((a, b) =>
      a.name.localeCompare(b.name)
    ).slice(0, testQueryLimit);
    expect(res.body).toHaveLength(expectedStores.length);
    res.body.map((store, i) =>
      expect(store["store-id"]).toEqual(expectedStores[i]["store-id"])
    );
  });
  it("should display list of items given barcodes", async () => {
    const testMerchant = "WPANCUD";
    const testBarcodes = TEST_ITEMS.filter(
      (item) => item["merchant-id"] === testMerchant
    ).map((item) => item["barcode"]);
    const res = await request(app).post("/api/item/list").send({
      "merchant-id": testMerchant,
      barcode: testBarcodes,
    });
    expect(res.statusCode).toEqual(CONSTANTS.HTTP_SUCCESS);
    expect(res.body).toHaveLength(testBarcodes.length);
    expect(
      res.body.every((item) => testBarcodes.includes(item["barcode"]))
    ).toBe(true);
  });
});

describe("API GET Nonce", () => {
  it("should get a static nonce", async () => {
    const res = await request(app).get("/api/nonce");
    expect(res.text).toEqual("static nonce");
  });
});

describe("Test api/order endpoints", () => {
  const testUserId = TEST_USERS[0]["user-id"];
  authenticateUser.mockImplementation((req, res, next) => {
    req.userId = testUserId;
    next();
  });

  it("should add a new order", async () => {
    const testUserId = TEST_USERS[0]["user-id"];
    const res = await request(app).post("/api/order/add").send({
      merchantId: "TEST_MERCHANT",
      orderId: "TEST_ORDER",
    });
    expect(res.statusCode).toEqual(CONSTANTS.HTTP_SUCCESS);
    expect(res.text).toEqual("TEST_ORDER");
  });

  it("should get TEST_USER orders", async () => {
    const expectedOrders = TEST_ORDERS.filter(
      (order) => order["user-id"] === testUserId
    );
    const res = await request(app).get("/api/order/list");
    expect(res.body).toHaveLength(expectedOrders.length);
    expect(res.body.every((order) => order["user-id"] === testUserId)).toBe(
      true
    );
  });
});
