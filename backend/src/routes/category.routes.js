const express = require("express");
const { getAll, create,update, remove } = require("../controllers/category.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", getAll);
router.post("/", authMiddleware, adminMiddleware, create);
router.patch("/", authMiddleware, adminMiddleware, update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

module.exports = router;