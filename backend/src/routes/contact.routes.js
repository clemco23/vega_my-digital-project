const express = require("express");
const { getContacts } = require("../controllers/contact.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getContacts);

module.exports = router;