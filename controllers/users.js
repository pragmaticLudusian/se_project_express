const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
  UNAUTHORIZED,
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
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) =>
      res.status(201).send({
        user: {
          _id: user._id,
          email: user.email,
        },
      })
    )
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.code === 11000) {
        error.message =
          "Duplicate email address conflicting with already-existing user's email.";
        return res.status(CONFLICT).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send(token);
    })
    .catch((error) => {
      console.error(error);
      res.status(UNAUTHORIZED).send({ message: error.message });
    });
};
