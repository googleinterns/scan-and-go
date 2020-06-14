const { Firestore } = require("@google-cloud/firestore");

// Initialize Server <-> DB communication
const firestore = new Firestore();

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
