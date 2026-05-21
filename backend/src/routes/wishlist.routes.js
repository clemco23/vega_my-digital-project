const express = require("express");
const { getWishlist, addItem, deleteItem, getAllWishlistsAdmin } = require("../controllers/wishlist.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/admin", authMiddleware, adminMiddleware, getAllWishlistsAdmin);
router.get("/", authMiddleware, getWishlist);
router.post("/", authMiddleware, addItem);
router.delete("/:variantId", authMiddleware, deleteItem);

module.exports = router;