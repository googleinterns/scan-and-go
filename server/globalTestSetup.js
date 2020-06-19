const { populate } = require("./emulatedFirestore");

module.exports = async () => {
  await populate();
};
