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
  const curUsers = await firestore.collection(USERS_COLLECTION).get();
  if (true || !curUsers.docs.length) {
    console.log("Populating USER entries");
    for (const user of TEST_USERS) {
      await firestore.collection(USERS_COLLECTION).add(user);
    }
  }
  const curItems = await firestore.collection(ITEMS_COLLECTION).get();
  if (true || !curItems.docs.length) {
    console.log("Populating ITEM entries");
    for (const item of TEST_ITEMS) {
      await firestore.collection(ITEMS_COLLECTION).add(item);
    }
  }
  const curStores = await firestore.collection(STORES_COLLECTION).get();
  if (true || !curStores.docs.length) {
    console.log("Populating STORE entries");
    for (const store of TEST_STORES) {
      await firestore.collection(STORES_COLLECTION).add(store);
    }
  }
  const curOrders = await firestore.collection(ORDERS_COLLECTION).get();
  if (true || !curOrders.docs.length) {
    console.log("Populating ORDER entries");
    for (const order of TEST_ORDERS) {
      await firestore.collection(ORDERS_COLLECTION).add(order);
    }
  }
};

module.exports.firestore = firestore;
module.exports.populate = setupSimulatedDB;
