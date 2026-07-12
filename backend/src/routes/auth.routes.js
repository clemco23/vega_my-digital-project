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

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthRegisterRequest'
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthRegisterResponse'
 *       400:
 *         description: Invalid payload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       409:
 *         description: Email already used
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Authenticate a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthLoginRequest'
 *     responses:
 *       200:
 *         description: Successful authentication
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthLoginResponse'
 *       400:
 *         description: Missing credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       401:
 *         description: Invalid credentials or unverified account
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Get the currently authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CurrentUserResponse'
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/logout:
 *   get:
 *     tags: [Auth]
 *     summary: Logout and redirect to the frontend
 *     parameters:
 *       - in: query
 *         name: redirect
 *         description: Frontend URL used after logout
 *         schema:
 *           type: string
 *           example: http://localhost:5173
 *     responses:
 *       302:
 *         description: Redirect to the frontend logout destination
 * /api/auth/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify a newly created account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthVerifyRequest'
 *     responses:
 *       200:
 *         description: Account verified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid email or token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/resend-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Resend the email verification code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthEmailRequest'
 *     responses:
 *       200:
 *         description: Verification code sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Send a password reset email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthEmailRequest'
 *     responses:
 *       200:
 *         description: Reset email sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Reset a password with a valid token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AuthResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Password reset completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Invalid or expired reset token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/google:
 *   get:
 *     tags: [Auth]
 *     summary: Start the Google OAuth flow
 *     responses:
 *       302:
 *         description: Redirect to Google consent screen
 *       503:
 *         description: Google authentication is unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 * /api/auth/google/callback:
 *   get:
 *     tags: [Auth]
 *     summary: Google OAuth callback endpoint
 *     responses:
 *       302:
 *         description: Redirect to frontend with token and serialized user
 *       503:
 *         description: Google authentication is unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 */

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
