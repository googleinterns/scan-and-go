module.exports.sortUsers = (a, b) => {
  return a["user-id"] < b["user-id"];
};

module.exports.sortItems = (a, b) => {
  if (a["barcode"] === b["barcode"]) {
    return a["merchant-id"] < b["merchant-id"];
  }
  return a["barcode"] < b["barcode"];
};

module.exports.sortStores = (a, b) => {
  return a["store-id"] < b["store-id"];
};

module.exports.sortOrders = (a, b) => {
  return a["order-id"] < b["order-id"];
};
