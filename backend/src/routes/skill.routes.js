const express = require("express");
const { getAll, create, remove, addToProduct, removeFromProduct } = require("../controllers/skill.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getAll);
router.post("/", authMiddleware, adminMiddleware, create);
router.delete("/:id", authMiddleware, adminMiddleware, remove);
router.post("/products/:id", authMiddleware, adminMiddleware, addToProduct);
router.delete("/products/:id/:skillId", authMiddleware, adminMiddleware, removeFromProduct);

module.exports = router;