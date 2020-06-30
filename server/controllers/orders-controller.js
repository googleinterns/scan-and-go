const { ordersCollection } = require("./../firestore");

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

  const merchantId = reqProps["merchant-id"];
  const orderId = reqProps["order-id"];
  const userId = reqProps["user-id"];

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
