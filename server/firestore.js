const { Firestore } = require("@google-cloud/firestore");
const { ENV, TEST } = require("./config");

// Determine which database to use, testing local? or remote live
// Emulated:  Load up our emulated firestore object after
//            initializing it in a separate script
// Live:      Initialize Server <-> Live DB communication
const firestore =
  ENV === TEST ? require("./emulatedFirestore") : new Firestore();
// Note:  The interface declared in @firebase/testing and
//        @google-cloud/firestore matches when we run our
//        emulated database with:
//        `firebase emulators:start --only firestore`

// Expose handlers to our DB objects
const usersCollection = firestore.collection("users");
const itemsCollection = firestore.collection("items");
const storesCollection = firestore.collection("stores");

module.exports = {
  firestore,
  usersCollection,
  itemsCollection,
  storesCollection,
};
