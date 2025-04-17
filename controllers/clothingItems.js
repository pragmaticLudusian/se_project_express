const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  FORBIDDEN,
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
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.id)
    .orFail(() => {
      const error = new Error("Clothing item ID not found.");
      error.name = "NotFoundError";
      error.statusCode = NOT_FOUND;
      throw error; // db queries normally don't show errors, so throw one
    }) // doesn't cover ObjectID casting (24-char string)
    .then((item) => {
      if (JSON.stringify(req.user._id) !== JSON.stringify(item.owner)) {
        const error = new Error("You can't delete someone else's clothing.");
        error.name = "ForbiddenError";
        error.statusCode = FORBIDDEN;
        throw error; // Promise.reject can work here too, but not inside orFail()
      }
      ClothingItem.deleteOne(item).catch(); // for some reason without the catch block it won't function separately from just find the id
      res.send({
        message: `Clothing item ID ${req.params.id} has been deleted.`,
      });
    })
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.name === "ForbiddenError") {
        return res.status(error.statusCode).send({ message: error.message });
      }
      if (error.name === "NotFoundError") {
        return res.status(error.statusCode).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    {
      $addToSet: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item ID not found.");
      error.name = "NotFoundError";
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then(() =>
      res.status(201).send({
        message: `Clothing item ID ${req.params.id} has been liked by user ID ${req.user._id}.`,
      })
    ) // updating by adding a like resource in an array can be 200/201
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.name === "NotFoundError") {
        return res.status(error.statusCode).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};

module.exports.unlikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("Clothing item ID not found.");
      error.name = "NotFoundError";
      error.statusCode = NOT_FOUND;
      throw error;
    })
    .then(() =>
      res.send({
        message: `Clothing item ID ${req.params.id} has been liked by user ID ${req.user._id}.`,
      })
    )
    .catch((error) => {
      console.error(error);
      if (error.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: error.message });
      }
      if (error.name === "NotFoundError") {
        return res.status(error.statusCode).send({ message: error.message });
      }
      return INTERNAL_SERVER_ERROR(res);
    });
};
