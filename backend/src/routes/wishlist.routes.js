const express = require("express");
const { getWishlist, addItem, deleteItem, getAllWishlistsAdmin } = require("../controllers/wishlist.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/admin", authMiddleware, getAllWishlistsAdmin);
router.get("/", authMiddleware, getWishlist);
router.post("/", authMiddleware, addItem);
router.delete("/:id", authMiddleware, deleteItem);
module.exports = router;