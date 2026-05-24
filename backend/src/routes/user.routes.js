const express = require("express");
const {
  getAll,
  getOne,
  update,
  updateRole,
  remove,
} = require("../controllers/user.controller");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAll);
router.patch("/:id/role", authMiddleware, adminMiddleware, updateRole);
router.get("/:id", authMiddleware, getOne);
router.patch("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

module.exports = router;
