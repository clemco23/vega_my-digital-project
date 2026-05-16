const express = require("express");
const { getContacts, getContactOne, createContactMessage } = require("../controllers/contact.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getContacts);
router.get("/:id", authMiddleware, adminMiddleware, getContactOne);
router.post("/", createContactMessage);

module.exports = router;