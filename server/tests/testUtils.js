module.exports.sortUsers = (a, b) => {
  return a["user-id"] < b["user-id"] ? -1 : 1;
};

module.exports.sortItems = (a, b) => {
  if (a["barcode"] === b["barcode"]) {
    return a["merchant-id"] < b["merchant-id"] ? -1 : 1;
  }
  return a["barcode"] < b["barcode"] ? -1 : 1;
};

module.exports.sortStores = (a, b) => {
  return a["store-id"] < b["store-id"] ? -1 : 1;
};

module.exports.sortOrders = (a, b) => {
  return a["order-id"] < b["order-id"] ? -1 : 1;
};
