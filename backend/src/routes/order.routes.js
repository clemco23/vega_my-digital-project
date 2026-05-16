const express = require("express");
const { create, getAll, getOne, updateStatus, getAllAdmin } = require("../controllers/order.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/admin", authMiddleware, adminMiddleware, getAllAdmin);
router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getOne);
router.post("/", authMiddleware, create);
router.put("/:id/status", authMiddleware, adminMiddleware, updateStatus);

module.exports = router;