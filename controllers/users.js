const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((error) => {
      console.error(error);
      return INTERNAL_SERVER_ERROR(res); // return is implicit in here and in the func call, but just in case
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      const error = new Error("User ID not found.");
      error.name = "NotFoundError";
      error.statusCode = NOT_FOUND;
      throw error; // db queries normally don't show errors, so throw one
    }) // doesn't cover ObjectID casting (24-char string)
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.name === "NotFoundError") {
        return res.status(NOT_FOUND).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};
