const express = require("express");
const {
  getCart,
  addItem,
  removeItem,
  emptyCart,
  create,
  getAll,
  getOne,
  updateStatus,
  getAllAdmin,
  updateItem
} = require("../controllers/order.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

// Panier
router.get("/cart", authMiddleware, getCart);
router.post("/cart/add", authMiddleware, addItem);
router.delete("/cart/empty", authMiddleware, emptyCart);
router.delete("/cart/:variantId", authMiddleware, removeItem);
router.put("/cart/:variantId", authMiddleware, updateItem);

// Commandes
router.get("/admin", authMiddleware, adminMiddleware, getAllAdmin);
router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getOne);
router.post("/", authMiddleware, create);
router.put("/:id/status", authMiddleware, adminMiddleware, updateStatus);

module.exports = router;