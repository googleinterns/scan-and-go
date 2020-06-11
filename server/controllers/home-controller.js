const { Firestore } = require("@google-cloud/firestore");

exports.homeGet = async (req, res) => {
  //Yiheng: Cost of initializing new entry into Firestore()?
  const firestore = new Firestore();
  const collectionRef = firestore.collection("users");
  let reqProps = req.body;
  let username = "commander";
  console.log("waiting on firestore");
  try {
    const snapshot = await collectionRef.get();
    const users = snapshot.docs.map((doc) => doc.data());
    if (reqProps["user-id"]) {
      for (let i = 0; i < users.length; ++i) {
        if (users[i]["user-id"] == reqProps["user-id"]) {
          username = users[i]["name"];
          break;
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.send(err.stack);
  } finally {
    res.send(`Welcome back ${username}.`);
  }
};
