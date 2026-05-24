const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  findUserByEmail,
  createUser,
  verifyUser,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
} = require("../services/auth.service");
const { getUserById } = require("../services/user.service");
const {
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../services/mail.service");

const toPublicUser = (user) => ({
  id: user.id.toString(),
  name: user.name,
  firstname: user.firstname,
  email: user.email,
  role: user.role,
  avatar: user.avatar ?? null,
});

const register = async (req, res) => {
  try {
    const { name, firstname, email, password } = req.body;

    if (!name || !firstname || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "L'adresse email n'est pas valide.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit faire au moins 8 caracteres.",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "Cette adresse email est deja utilisee.",
      });
    }

    const user = await createUser({ name, firstname, email, password });

    await sendVerificationEmail(email, user.validationToken);

    return res.status(201).json({
      message: "Inscription reussie. Verifiez votre email.",
      data: toPublicUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const verify = async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email || !token) {
      return res.status(400).json({ message: "Email et code obligatoires." });
    }

    await verifyUser(email, token);

    return res.status(200).json({ message: "Compte verifie avec succes." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email et mot de passe obligatoires.",
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    if (!user.verifiedAt) {
      return res.status(401).json({
        message: "Veuillez verifier votre email avant de vous connecter.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const token = jwt.sign(
      { id: user.id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Connexion reussie.",
      token,
      data: toPublicUser(user),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email obligatoire." });
    }

    const token = await resendVerificationEmail(email);
    await sendVerificationEmail(email, token);

    return res.status(200).json({ message: "Code renvoye." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email obligatoire." });
    }

    const token = await forgotPassword(email);
    await sendResetPasswordEmail(email, token);

    return res
      .status(200)
      .json({ message: "Email de reinitialisation envoye." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit faire au moins 8 caracteres.",
      });
    }

    await resetPassword(email, token, newPassword);

    return res
      .status(200)
      .json({ message: "Mot de passe reinitialise avec succes." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    return res.status(200).json({ data: toPublicUser(user) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  register,
  login,
  getCurrentUser,
  verify,
  resendVerification,
  forgotPasswordController,
  resetPasswordController,
};
