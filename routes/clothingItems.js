const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getClothingItems);

router.use(auth);

router.post("/", createClothingItem);
router.delete("/:id", deleteClothingItem);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;
