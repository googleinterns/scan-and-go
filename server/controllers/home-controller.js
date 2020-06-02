const users = require("./../data/users.json");

exports.homeGet = async (req, res) => {
  let reqProps = req.body;
  let username = "commander";
  if (reqProps.hasOwnProperty("id")) {
    for (let i = 0; i < users.length; ++i) {
      if (users[i]["id"] == reqProps["id"]) {
        username = users[i]["username"];
        break;
      }
    }
  }
  res.send(`Welcome back ${username}.`);
};
