const users = require("./../data/users.json");

exports.homeGet = async (req, res) => {
  let reqProps = req.body;
  let username = "commander";
  if (reqProps.hasOwnProperty("user-id")) {
    for (let i = 0; i < users.length; ++i) {
      if (users[i]["user-id"] == reqProps["user-id"]) {
        username = users[i]["name"];
        break;
      }
    }
  }
  res.send(`Welcome back ${username}.`);
};
