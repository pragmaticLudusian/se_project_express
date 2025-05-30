const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { JWT_SECRET } = process.env;
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getCurrentUser = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      console.error(error);
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userCopy = JSON.parse(JSON.stringify(user)); // create deep copy of the user object...
      delete userCopy.password; // ...as its properties could then be deleted before sending the res
      res.status(201).send({
        user: userCopy,
      });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.code === 11000) {
        // MongoServerError
        return res.status(CONFLICT).send({
          message:
            "Duplicate email address conflicting with already-existing user's email.",
        });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "1w",
      });
      res.send({ token });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(error.statusCode).send({ message: error.message });
      }
      if (error.name === "UnauthorizedError") {
        return res.status(error.statusCode).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.updateUser = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      const error = new Error("User ID not found.");
      error.name = "NotFoundError";
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then(() => res.send({ data: { name, avatar } }))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.name === "NotFoundError") {
        return res.status(error.statusCode).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};
