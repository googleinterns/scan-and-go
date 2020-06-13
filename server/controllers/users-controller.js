const config = require("./../config");
const { usersCollection } = require("./../firestore");
const { flatMap } = require("./../utils");

exports.listUsers = async (req, res) => {
  let users = [];
  try {
    const usersQuery = await usersCollection.get();
    users = usersQuery.docs.map((doc) => doc.data());
  } catch (err) {
    console.err(err);
  } finally {
    res.json(users);
  }
};

exports.getUser = async (req, res) => {
  const reqProps = req.body;
  let user = {};

  const userID = reqProps["user-id"];

  try {
    if (userID) {
      const userQuery = await usersCollection
        .where("user-id", "==", userID)
        .get();
      const users = userQuery.docs.map((doc) => doc.data());
      user = flatMap(users, {});
    }
  } catch (err) {
    console.err(err);
  } finally {
    res.json(user);
  }
};
