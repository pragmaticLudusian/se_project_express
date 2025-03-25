const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");

router.get("/", getUsers); // implies /users
router.get("/:id", getUser);
router.post("/", createUser);

module.exports = router;
