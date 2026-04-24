const User = require("../models/user.model");

async function isAdmin(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user && user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied. Admin only." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error in admin check" });
  }
}

module.exports = isAdmin;
