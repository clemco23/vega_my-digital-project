const express = require("express");
const { register, login, verify, resendVerification } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/resend-verification", resendVerification);

module.exports = router;