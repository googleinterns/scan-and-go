const firebase = require("@firebase/testing");

// Restart emulators first
firebase.apps().map((app) => {
  console.log(app);
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
  const {
    USERS_COLLECTION,
    ITEMS_COLLECTION,
    STORES_COLLECTION,
    ORDERS_COLLECTION,
  } = require("./constants");
  console.log("setting up emulation firestore");

  // Add our dummy data into emulated firestore
  for (let user of TEST_USERS) {
    await firestore.collection(USERS_COLLECTION).add(user);
  }
  for (let item of TEST_ITEMS) {
    await firestore.collection(ITEMS_COLLECTION).add(item);
  }
  for (let store of TEST_STORES) {
    await firestore.collection(STORES_COLLECTION).add(store);
  }
  for (let order of TEST_ORDERS) {
    await firestore.collection(ORDERS_COLLECTION).add(order);
  }
};

setupSimulatedDB();

module.exports = firestore;
