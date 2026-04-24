const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

function mustBeLoggedIn(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "No token provided",
      data: false,
    });
  }

  // Extract token from Bearer token
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.user = payload; // الآن يحتوي على id, email, role
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      data: false,
    });
  }
}

module.exports = mustBeLoggedIn;
