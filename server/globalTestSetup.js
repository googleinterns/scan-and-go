const { populate } = require("./emulatedFirestore");

module.exports = async () => {
  console.log("Waiting for DB to populate");
  await populate();
};
