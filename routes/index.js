const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, login } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);
router.use("/users", require("./users"));
router.use("/items", require("./clothingItems"));

router.use(auth);

router.use("/", (req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found." });
}); // apply to every unlisted route

module.exports = router; // required for require() imports to app.js
