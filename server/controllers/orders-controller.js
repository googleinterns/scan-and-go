const { Timestamp } = require("@google-cloud/firestore");
const { ordersCollection } = require("./../firestore");
const { SPOT_BASE_URL, SPOT_ORDERS_SCOPE } = require("./../constants");
const { flatMap } = require("./../utils");

const { JWT } = require("google-auth-library");

/**
 * Sends a HTTPS request to the specified endpoint
 *
 * @param {string} scope - the authorization scope required for the OAuth token.
 * @param {string} url - the request URL.
 * @param {string} method - the request method.
 * @param {string} body - the request payload.
 */
const request = (scope, url, method, body) => {
  const client = new JWT({
    email: process.env.EXPRESS_SERVER_SERVICE_ACCOUNT_CLIENT_EMAIL,
    key: (process.env.EXPRESS_SERVER_SERVICE_ACCOUNT_PRIVATE_KEY || "").replace(
      new RegExp("\\\\n", "g"),
      "\n"
    ), // Nodejs replaces "\n" with "\\n", so we need to revert this https://github.com/googleapis/google-api-nodejs-client/issues/1110
    scopes: [scope],
  });
  return client.request({ url: url, method: method, data: body });
};

/**
 * Adds an order to the orders collection.
 * Returns the order ID if successful, and empty string
 * otherwise.
 *
 * @param {Object} req - The request.
 * @param {Object} res - The response.
 * @param {Object} req.body - The JSON payload.
 */
exports.addOrder = async (req, res) => {
  const reqProps = req.body;
  let retId = "";

  const merchantId = reqProps.merchantId;
  const orderId = reqProps.orderId;
  const storeId = reqProps.storeId;
  const userId = req.userId;

  try {
    if (merchantId && orderId && storeId && userId) {
      await ordersCollection
        .add({
          "merchant-id": merchantId,
          "order-id": orderId,
          "store-id": storeId,
          "user-id": userId,
          timestamp: Timestamp.now(),
        })
        .then(() => {
          retId = orderId;
        });
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.send(retId);
  }
};

/**
 * Returns a list of orders associated with a user.
 *
 * @param {Object} req - The request.
 * @param {Object} res - The response.
 */
exports.listOrders = async (req, res) => {
  const userId = req.userId;
  let orders = [];

  try {
    if (userId) {
      const ordersQuery = await ordersCollection
        .where("user-id", "==", userId)
        .get();
      orders = ordersQuery.docs.map((doc) => doc.data());
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.json(orders);
  }
};

/**
 * Updates an order actions to allow the user to view the order details.
 *
 * @param {Object} req - The request.
 * @param {Object} res - The response.
 * @param {String} req.body.orderName - The order name in the form of {merchants/*\/orders/*}.
 */
exports.updateOrder = async (req, res) => {
  const orderName = req.body.orderName;
  let order = {};

  try {
    if (orderName) {
      const updateMask = "actions";
      const updateBody = {
        actions: [
          {
            label: "RECEIPT",
            url: `https://microapps.google.com/${
              process.env.EXPRESS_SERVER_MICROAPP_ID
            }?link=${encodeURIComponent(`receipt?order=${orderName}`)}`,
          },
        ],
      };
      const url = `${SPOT_BASE_URL}/${orderName}?updateMask=${updateMask}`;
      await request(
        SPOT_ORDERS_SCOPE,
        url,
        "PATCH",
        JSON.stringify(updateBody)
      ).then((response) => {
        order = response.data;
      });
    }
  } catch (err) {
    console.error("updateOrder: ", err);
  } finally {
    res.json(order);
  }
};

/**
 * Gets the Spot order, identified by its merchant ID and order ID, and its creation timestamp.
 *
 * @param {Object} req - The request.
 * @param {Object} res - The response.
 * @param {String} req.params.merchantId - The merchant id parameter passed as /api/order/merchants/:merchantId/orders/*
 * @param {String} req.params.orderId - The order id parameter passed as /api/order/merchants/*\/orders/:orderId
 */
exports.getOrder = async (req, res) => {
  const merchantId = req.params.merchantId;
  const orderId = req.params.orderId;
  const url = `${SPOT_BASE_URL}/merchants/${merchantId}/orders/${orderId}`;
  const order = {};

  try {
    if (merchantId && orderId) {
      // get the order from the Spot server
      await request(SPOT_ORDERS_SCOPE, url, "GET").then((response) => {
        Object.assign(order, response.data);
      });

      // get the timestamp from the Firestore document
      await ordersCollection
        .where("merchant-id", "==", merchantId)
        .where("order-id", "==", orderId)
        .get()
        .then((ordersQuery) => {
          const orders = ordersQuery.docs.map((doc) => doc.data());
          const orderDoc = flatMap(orders, {});
          Object.assign(order, {
            timestamp: orderDoc.timestamp.toDate(),
            storeId: orderDoc["store-id"],
          });
        });
    }
  } catch (err) {
    console.error("getOrder: ", err);
  } finally {
    res.json(order);
  }
};
