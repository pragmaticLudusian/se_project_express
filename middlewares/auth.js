const { JWT_SECRET } = process.env;
const jwt = require("jsonwebtoken");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required." });
  }

  const token = authorization.replace("Bearer ", "");

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required." });
  }

  req.user = payload;
  next();
};
