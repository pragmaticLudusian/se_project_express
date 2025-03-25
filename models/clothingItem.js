const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    required: true,
    type: String,
    enum: ["hot", "warm", "cool", "cold"],
  },
  imageUrl: {
    required: true,
    type: String,
    validate: {
      validator: (value) => require("validator").isURL(value),
      message: "You must enter a valid URL",
    },
  },
  owner: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
