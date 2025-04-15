const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email,
  password
) {
  return this.findOne({ email }) // this = the User model
    .then((user) => {
      if (!user) return Promise.reject(new Error("[user]/pw incorrect"));
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) return Promise.reject(new Error("user/[pw] incorrect"));
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
