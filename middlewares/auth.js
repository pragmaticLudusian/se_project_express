const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required." });
  }

  const token = authorization.replace("Bearer ", "");

  let payload; // should be in this scope to put into req later
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error(error);
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Authorization required." });
  }

  req.user = payload;
  next();
  return null; // expected to return a value at the end of arrow function (consistent-return)
};
