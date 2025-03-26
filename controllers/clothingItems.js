const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((error) => {
      console.error(error);
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => res.status(201).send({ data: item }))
    .catch((error) => {
      console.error(error);
      if (error.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      } else {
        return INTERNAL_SERVER_ERROR(res);
      }
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .orFail(() => {
      const error = new Error("Clothing item ID not found.");
      error.name = "NotFoundError";
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then((item) => res.status(204).send({ data: item }))
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      } else if (error.name === "NotFoundError") {
        return res.status(NOT_FOUND).send({ message: error.message });
      } else {
        return INTERNAL_SERVER_ERROR(res);
      }
    });
};
