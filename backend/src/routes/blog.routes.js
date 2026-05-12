const express = require("express");
const { getAll, getOne, create, update, remove } = require("../controllers/blog.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../config/cloudinary");

const router = express.Router();

router.get("/", getAll);
router.get("/:slug", getOne);
router.post("/", authMiddleware, adminMiddleware, upload.single("picture"), create);
router.patch("/:id", authMiddleware, adminMiddleware, upload.single("picture"), update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

module.exports = router;