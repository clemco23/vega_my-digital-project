const express = require("express");
const { getAll, getOne, create, update, remove, getAllAdmin } = require("../controllers/product.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../config/cloudinary");

const router = express.Router();

router.get("/", getAll);
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), create);
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);
router.get("/admin", authMiddleware, adminMiddleware, getAllAdmin);
router.get("/:id", getOne);

module.exports = router;