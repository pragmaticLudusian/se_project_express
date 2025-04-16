const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const { getClothingItems } = require("../controllers/clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);
router.get("/items", getClothingItems);

router.use(auth); // following this line do need auth

router.use("/items", require("./clothingItems"));

router.use("/", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found." });
}); // apply to every unlisted route

module.exports = router; // required for require() imports to app.js
