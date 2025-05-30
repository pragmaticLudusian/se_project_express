module.exports.BAD_REQUEST = 400;
module.exports.UNAUTHORIZED = 401;
module.exports.FORBIDDEN = 403;
module.exports.NOT_FOUND = 404;
module.exports.CONFLICT = 409;
module.exports.INTERNAL_SERVER_ERROR = (res) =>
  res.status(500).send({ message: "An error has occurred on the server." });
