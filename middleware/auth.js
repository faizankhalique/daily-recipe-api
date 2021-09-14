const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  const token = req.header("x-auth-token"); //get token from request header
  if (!token)
    return res
      .status(401)
      .send("Access denied.No token Provided. Unauthorized");
  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey")); //returns payload
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("Invalid token ");
  }
};
