const express = require("express");
// const passport = require("../config/passport");
// const jwt = require("jsonwebtoken");
const { register, login, verify, resendVerification,forgotPasswordController, resetPasswordController } = require("../controllers/auth.controller");

const router = express.Router();

// router.get("/google", passport.authenticate("google", {
//     scope: ["profile", "email"],
//   }));
  
//   router.get("/google/callback",
//     passport.authenticate("google", { failureRedirect: "/login" }),
//     (req, res) => {
//       const user = req.user;
  
//       const token = jwt.sign(
//         { id: user.id.toString(), email: user.email, role: user.role },
//         process.env.JWT_SECRET,
//         { expiresIn: "7d" }
//       );
  
//       // Redirige vers le frontend avec le token
//       res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&user=${JSON.stringify({
//         id: user.id.toString(),
//         name: user.name,
//         firstname: user.firstname,
//         email: user.email,
//         role: user.role,
//         avatar: user.avatar,
//       })}`);
//     }
//   );

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verify);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

module.exports = router;