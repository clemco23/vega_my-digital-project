const express = require("express");
const { getByProduct, create, moderate, getAll } = require("../controllers/review.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/admin", authMiddleware, adminMiddleware, getAll);
router.get("/product/:productId", getByProduct);
router.post("/", authMiddleware, create);
router.put("/:id/moderate", authMiddleware, adminMiddleware, moderate);

module.exports = router;