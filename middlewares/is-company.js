const isCompany = (req, res, next) => {
    if (req.user && (req.user.role === "company" || req.user.role === "admin")) {
      next();
    } else {
      return res.status(403).json({
        message: "Access denied. Only companies can perform this action.",
        status: "error",
      });
    }
  };
  
  module.exports = isCompany;