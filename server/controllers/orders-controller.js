const { ordersCollection } = require("./../firestore");

exports.addOrder = async (req, res) => {
  const reqProps = req.body;
  let docId = "";

  const merchantId = reqProps["merchant-id"];
  const orderId = reqProps["order-id"];
  const userId = reqProps["user-id"];

  try {
    if (merchantId && orderId && userId) {
      const addDoc = ordersCollection
        .add({
          "merchant-id": merchantId,
          "order-id": orderId,
          "user-id": userId,
        })
        .then((ref) => {
          docId = ref.id;
        });
    }
  } catch (err) {
    console.error(err);
  } finally {
    res.send(docId);
  }
};

exports.listOrders = async (req, res) => {
  const reqProps = req.body;
  let orders = [];

  const userId = reqProps["user-id"];

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
