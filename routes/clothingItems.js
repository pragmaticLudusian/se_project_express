const router = require("express").Router();
const {
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.post("/", createClothingItem);
router.delete("/:id", deleteClothingItem);
router.put("/:id/likes", likeItem);
router.delete("/:id/likes", unlikeItem);

module.exports = router;
