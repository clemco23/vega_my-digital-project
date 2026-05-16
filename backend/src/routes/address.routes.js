const express = require("express");
const { getAll, create, update, remove, getByuserId  } = require("../controllers/address.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, getAll);
router.get("/user/:userId", authMiddleware, adminMiddleware, getByuserId);
router.post("/", authMiddleware, create);
router.put("/:id", authMiddleware, update);
router.delete("/:id", authMiddleware, remove);

module.exports = router;