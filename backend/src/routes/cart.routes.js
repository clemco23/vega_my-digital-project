const express = require("express");
const { getCart, addItem, updateItem, deleteItem, emptyCart } = require("../controllers/cart.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addItem);
router.put("/:itemId", authMiddleware, updateItem);
router.delete("/empty", authMiddleware, emptyCart);
router.delete("/:itemId", authMiddleware, deleteItem);

module.exports = router;