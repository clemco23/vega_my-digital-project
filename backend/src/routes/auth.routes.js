const express = require("express");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  register,
  login,
  getCurrentUser,
  verify,
  resendVerification,
  forgotPasswordController,
  resetPasswordController,
} = require("../controllers/auth.controller");

const router = express.Router();

if (passport.hasGoogleAuthConfig) {
  router.get(
    "/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    })
  );

  router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      const user = req.user;
      const publicUser = {
        id: user.id.toString(),
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };

      const token = jwt.sign(
        { id: user.id.toString(), email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const params = new URLSearchParams({
        token,
        user: JSON.stringify(publicUser),
      });

      res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?${params.toString()}`
      );
    }
  );
} else {
  router.get("/google", (_req, res) => {
    return res
      .status(503)
      .json({ message: "Connexion Google indisponible pour le moment." });
  });

  router.get("/google/callback", (_req, res) => {
    return res
      .status(503)
      .json({ message: "Connexion Google indisponible pour le moment." });
  });
}

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);
router.get("/logout", (req, res, next) => {
  const redirectUrl = req.query.redirect || process.env.FRONTEND_URL;

  req.logout((error) => {
    if (error) {
      return next(error);
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        return next(sessionError);
      }

      res.clearCookie("connect.sid");
      return res.redirect(redirectUrl);
    });
  });
});
router.post("/verify", verify);
router.post("/resend-verification", resendVerification);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

module.exports = router;
