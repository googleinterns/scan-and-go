const config = require("./../config");
const firestore = require("./../firestore");
const { UsersCollection } = require("./../db-consts");
const usersCollectionRef = firestore.collection(UsersCollection);
const env = process.env.NODE_ENV || config.DEV;

exports.usersGetAll = async (req, res) => {
  if (env == config.DEV) {
    console.time("Users ALL query");
  }
  const usersQuery = await usersCollectionRef.get();
  const users = usersQuery.docs.map((doc) => doc.data());
  if (env == config.DEV) {
    console.timeEnd("Users ALL query");
  }
  res.json(users);
};
