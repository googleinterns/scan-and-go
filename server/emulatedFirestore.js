const firebase = require("@firebase/testing");

// Restart emulators first
firebase.apps().map((app) => {
  app.delete();
});

// Initialize new database
const app = firebase.initializeAdminApp({ projectId: "scan-and-go-for-gpay" });

const firestore = app.firestore();

const setupSimulatedDB = async () => {
  // Grab the testing data from a separate file
  const TEST_USERS = require("./data/users.json");
  const TEST_ITEMS = require("./data/items.json");
  const TEST_STORES = require("./data/stores.json");
  const TEST_ORDERS = require("./data/orders.json");
  const TEST_MERCHANTS = require("./data/merchants.json");
  const {
    USERS_COLLECTION,
    ITEMS_COLLECTION,
    STORES_COLLECTION,
    ORDERS_COLLECTION,
    MERCHANTS_COLLECTION,
  } = require("./config");

  // Add our dummy data into emulated firestore
  for (const user of TEST_USERS) {
    await firestore.collection(USERS_COLLECTION).add(user);
  }
  for (const item of TEST_ITEMS) {
    await firestore.collection(ITEMS_COLLECTION).add(item);
  }
  for (const store of TEST_STORES) {
    await firestore.collection(STORES_COLLECTION).add(store);
  }
  for (const order of TEST_ORDERS) {
    await firestore.collection(ORDERS_COLLECTION).add(order);
  }
  for (const merchant of TEST_MERCHANTS) {
    await firestore.collection(MERCHANTS_COLLECTION).add(merchant);
  }
};

const clearDB = async () => {
  await firebase.clearFirestoreData({ projectId: "scan-and-go-for-gpay" });
};

module.exports.firestore = firestore;
module.exports.populate = setupSimulatedDB;
module.exports.clearDB = clearDB;
