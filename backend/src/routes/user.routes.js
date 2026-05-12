const express = require("express");
const { getAll, getOne, update, remove } = require("../controllers/user.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getAll);      // admin seulement
router.get("/:id", authMiddleware, getOne);                    // connecté
router.patch("/:id", authMiddleware, update);                    // son propre compte
router.delete("/:id", authMiddleware, remove);                 // son propre compte

module.exports = router;