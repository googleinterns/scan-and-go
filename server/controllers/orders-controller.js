const { ordersCollection } = require("./../firestore");
const { SPOT_BASE_URL, SPOT_ORDERS_SCOPE } = require("./../constants");
const { flatMap } = require("./../utils");

const { JWT } = require("google-auth-library");
// const {GoogleAuth} = require('google-auth-library');

const request = (scope, url, method, body) => {
  const client = new JWT({
    email: process.env.EXPRESS_SERVER_SERIVCE_ACCOUNT_CLIENT_EMAIL,
    key: process.env.EXPRESS_SERVER_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
      new RegExp("\\\\n", "g"),
      "\n"
    ), // https://github.com/googleapis/google-api-nodejs-client/issues/1110
    scopes: [scope],
  });
  return client.request({ url: url, method: method, data: body });
  // .then(response => {
  //   callback(null, response.data);
  // }).catch(err => {
  //   callback(err, null);
  // });
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
  const userId = req.userId;

  try {
    if (merchantId && orderId && userId) {
      await ordersCollection
        .add({
          "merchant-id": merchantId,
          "order-id": orderId,
          "user-id": userId,
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
 * @param {String} req.params.userId - The user id query passed as /api/order/list/<userId>
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
            label: "Details",
            url: `https://microapps.google.com/${process.env.EXPRESS_SERVER_MICROAPPS_CLIENT_ID}/receipt?order=${orderName}`,
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

exports.getOrder = async (req, res) => {
  const merchantId = req.params.merchantId;
  const orderId = req.params.orderId;
  const url = `${SPOT_BASE_URL}/merchants/${merchantId}/orders/${orderId}`;
  let order = {};

  try {
    if (merchantId && orderId) {
      await request(SPOT_ORDERS_SCOPE, url, "GET").then((response) => {
        order = response.data;
      });
    }
  } catch (err) {
    console.error("getOrder: ", err);
  } finally {
    res.json(order);
  }
};
