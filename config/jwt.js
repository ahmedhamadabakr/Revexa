const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.EXPIRES_IN,
};
module.exports = jwtConfig;

