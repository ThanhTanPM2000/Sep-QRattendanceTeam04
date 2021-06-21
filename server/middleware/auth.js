import jwt from "jsonwebtoken";
import config from "config";

module.exports = function (req, res, next) {
  if (!config.get("requireAuth")) return next();

  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
