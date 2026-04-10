const User = require("../models/user.model");

async function isAdmin(req, res, next) {

  const user = await User.findOne();

  if (user.role === "admin") {
    next();
  } else {
    res.status(403).send("You are not admin");
  }
}

module.exports = isAdmin;
