const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { findUserByEmail, createUser } = require("../services/auth.service");

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
        message: "Le mot de passe doit faire au moins 8 caractères.",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        message: "Cette adresse email est déjà utilisée.",
      });
    }

    const user = await createUser({ name, firstname, email, password });

    return res.status(201).json({
      message: "Inscription réussie.",
      data: {
        id: user.id.toString(),
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
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
      message: "Connexion réussie.",
      token,
      data: {
        id: user.id.toString(),
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { register, login };