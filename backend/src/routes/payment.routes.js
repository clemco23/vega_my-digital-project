const express = require("express");
const { checkout, webhook } = require("../controllers/payment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.post("/webhook" , webhook);

module.exports = router;