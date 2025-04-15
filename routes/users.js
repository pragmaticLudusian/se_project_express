const router = require("express").Router();
const {
  getUsers,
  getUser,
  createUser,
  login,
} = require("../controllers/users");

router.get("/", getUsers); // implies /users
router.get("/:id", getUser);
router.post("/", createUser);
router.post("/signin", login);

module.exports = router;
