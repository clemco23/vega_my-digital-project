const express = require("express");
const { register, login, verify, resendVerification,forgotPasswordController, resetPasswordController } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

module.exports = router;