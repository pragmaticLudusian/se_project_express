const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { UNAUTHORIZED, BAD_REQUEST } = require("../utils/errors");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator: (value) => validator.isURL(value), // latter validator refers to validator.js module; within lies URL validation
      message: "You must enter a valid URL.",
    },
  },
  email: {
    required: true,
    type: String,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You must enter a valid email.",
    },
    unique: true,
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  function throwAuthError() {
    // mongoose would return 200 if no error is thrown
    const error = new Error("User email and/or password is/are incorrect.");
    error.name = "UnauthorizedError";
    error.statusCode = UNAUTHORIZED;
    throw error;
  }
  if (!email || !password) {
    const error = new Error("Error syntax.");
    error.name = "ValidationError";
    error.statusCode = BAD_REQUEST;
    return Promise.reject(error); // throw wouldn't be effective here
  }
  return this.findOne({ email }) // this = the User model
    .select("+password") // include into the object despite select:false
    .then((user) => {
      if (!user) return Promise.reject(throwAuthError()); // would be triggered if user isn't authenticated - whether from empty input or incorrect input
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) return Promise.reject(throwAuthError());
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
