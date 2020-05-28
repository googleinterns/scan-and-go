const users = require('./../data/users.json')
exports.usersGetAll = async(req, res) => {
  res.json(users)
}
