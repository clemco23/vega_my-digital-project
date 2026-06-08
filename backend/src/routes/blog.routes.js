const express = require("express");
const {
  getAll,
  getAllAdmin,
  getOne,
  getOneById,
  create,
  update,
  remove,
} = require("../controllers/blog.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");
const upload = require("../config/cloudinary");

const router = express.Router();

router.get("/", getAll);
router.get("/admin", authMiddleware, adminMiddleware, getAllAdmin);
router.get("/id/:id", authMiddleware, adminMiddleware, getOneById);
router.post("/", authMiddleware, adminMiddleware, upload.single("picture"), create);
router.patch("/:id", authMiddleware, adminMiddleware, upload.single("picture"), update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);
router.get("/:slug", getOne);

module.exports = router;
