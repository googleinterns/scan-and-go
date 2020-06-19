const {
  usersCollection,
  itemsCollection,
  storesCollection,
  ordersCollection,
} = require("./../firestore");
const { sortUsers, sortItems, sortStores, sortOrders } = require("./testUtils");
const TEST_USERS = require("./../data/users.json").sort(sortUsers);
const TEST_ITEMS = require("./../data/items.json").sort(sortItems);
const TEST_STORES = require("./../data/stores.json").sort(sortStores);
const TEST_ORDERS = require("./../data/orders.json").sort(sortOrders);
const CONSTANTS = require("./../constants");

describe("Assert Mock Database Loaded", () => {
  it("Users database should match", async () => {
    const usersQuery = await usersCollection.get();
    const users = usersQuery.docs.map((doc) => doc.data()).sort(sortUsers);
    expect(users).toEqual(TEST_USERS);
  });
  it("Items database should match", async () => {
    const itemsQuery = await itemsCollection.get();
    const items = itemsQuery.docs.map((doc) => doc.data()).sort(sortItems);
    expect(items).toEqual(TEST_ITEMS);
  });
  it("Stores database should match", async () => {
    const storesQuery = await storesCollection.get();
    const stores = storesQuery.docs.map((doc) => doc.data()).sort(sortStores);
    expect(stores).toEqual(TEST_STORES);
  });
  it("Orders database should match", async () => {
    const ordersQuery = await ordersCollection.get();
    const orders = ordersQuery.docs.map((doc) => doc.data()).sort(sortOrders);
    expect(orders).toEqual(TEST_ORDERS);
  });
});
