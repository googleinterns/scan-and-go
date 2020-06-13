const config = require("./../config");
const firestore = require("./../firestore");
const { UsersCollection } = require("./../db-consts");
const usersCollectionRef = firestore.collection(UsersCollection);
const env = process.env.NODE_ENV || config.DEV;

exports.homeGet = async (req, res) => {
  let reqProps = req.body;
  let username = "commander";
  try {
    const userID = reqProps["user-id"];
    if (userID) {
      const userQuery = await usersCollectionRef
        .where("user-id", "==", userID)
        .get();
      const users = userQuery.docs.map((doc) => doc.data());
      if (users.length > 0) {
        username = users[0]["name"];
      }
    }
  } catch (err) {
    console.err(err);
  } finally {
    res.send(`Welcome back ${username}.`);
  }
};
