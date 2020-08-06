const { Firestore } = require("@google-cloud/firestore");
const {
  ENV,
  TEST,
  USERS_COLLECTION,
  ITEMS_COLLECTION,
  STORES_COLLECTION,
  ORDERS_COLLECTION,
  MERCHANTS_COLLECTION,
  INGESTION_COLLECTION,
} = require("./config");

// Determine which database to use, testing local? or remote live
// Emulated:  Load up our emulated firestore object after
//            initializing it in a separate script
// Live:      Initialize Server <-> Live DB communication
const firestore =
  ENV === TEST ? require("./emulatedFirestore").firestore : new Firestore();
// Note:  The interface declared in @firebase/testing and
//        @google-cloud/firestore matches when we run our
//        emulated database with:
//        `firebase emulators:start --only firestore`

// Expose handlers to our DB objects
const usersCollection = firestore.collection(USERS_COLLECTION);
const itemsCollection = firestore.collection(ITEMS_COLLECTION);
const storesCollection = firestore.collection(STORES_COLLECTION);
const ordersCollection = firestore.collection(ORDERS_COLLECTION);
const merchantsCollection = firestore.collection(MERCHANTS_COLLECTION);
const ingestionCollection = firestore.collection(INGESTION_COLLECTION);

// If testing environment, populate db
if (ENV === TEST) {
  require("./emulatedFirestore").populate();
}

module.exports = {
  firestore,
  usersCollection,
  itemsCollection,
  storesCollection,
  ordersCollection,
  merchantsCollection,
  ingestionCollection,
};
