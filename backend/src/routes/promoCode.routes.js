const express = require("express");
const {
  create,
  getAll,
  getOne,
  remove,
  update,
} = require("../controllers/promoCode.controller");
const {
  adminMiddleware,
  authMiddleware,
} = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAll);
router.get("/:id", authMiddleware, adminMiddleware, getOne);
router.post("/", authMiddleware, adminMiddleware, create);
router.put("/:id", authMiddleware, adminMiddleware, update);
router.delete("/:id", authMiddleware, adminMiddleware, remove);

module.exports = router;
