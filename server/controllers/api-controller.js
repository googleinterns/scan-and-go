const config = require("./../config");
const { usersCollection } = require("./../firestore");
const { flatMap } = require("./../utils");

exports.getWelcomeMessage = async (req, res) => {
  const reqProps = req.body;
  let username = "commander";

  const userID = reqProps["user-id"];

  try {
    if (userID) {
      const userQuery = await usersCollection
        .where("user-id", "==", userID)
        .get();
      const users = userQuery.docs.map((doc) => doc.data());
      const user = flatMap(users, null);
      if (user !== null) {
        username = user["name"];
      }
    }
  } catch (err) {
    console.err(err);
  } finally {
    res.send(`Welcome back ${username}.`);
  }
};
