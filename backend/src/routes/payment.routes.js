const express = require("express");
const {
  checkout,
  confirm,
  webhook,
} = require("../controllers/payment.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/checkout", authMiddleware, checkout);
router.get("/confirm/:orderId", authMiddleware, confirm);
router.post("/webhook" , webhook);

module.exports = router;
