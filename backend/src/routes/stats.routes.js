const express = require("express");
const { getDashboardStats } = require("../controllers/stats.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, adminMiddleware, getDashboardStats);

module.exports = router;