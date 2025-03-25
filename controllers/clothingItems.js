const ClothingItem = require("../models/clothingItem");

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send({ data: items }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
    .then((item) => res.send({ data: item }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
