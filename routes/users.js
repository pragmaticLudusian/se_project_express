const router = require("express").Router();
const auth = require("../middlewares/auth");
const { createUser, login, getCurrentUser } = require("../controllers/users");

router.post("/signup", createUser);
router.post("/signin", login);

router.use(auth);

router.get("/me", getCurrentUser);

module.exports = router;
