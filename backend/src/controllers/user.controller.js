const bcrypt = require("bcrypt");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../services/user.service");

const getAll = async (req, res) => {
  try {
    const users = await getAllUsers();
    const serialized = users.map((u) => ({ ...u, id: u.id.toString() }));
    return res.status(200).json({ data: serialized });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    // Un user ne peut voir que son propre profil, un admin peut voir n'importe quel profil
    if (req.user.role !== "ADMIN" && req.user.id !== id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    return res.status(200).json({ data: { ...user, id: user.id.toString() } });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, firstname, email, password } = req.body;

    // Vérifier que l'utilisateur modifie son propre compte
    if (req.user.id !== id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const data = {};
    if (name !== undefined) data.name = name;
    if (firstname !== undefined) data.firstname = firstname;
    if (email !== undefined) data.email = email;
    if (password !== undefined) data.password = await bcrypt.hash(password, 10);

    const updated = await updateUser(id, data);
    return res.status(200).json({
      message: "Utilisateur mis à jour.",
      data: { ...updated, id: updated.id.toString() },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier que l'utilisateur supprime son propre compte
    if (req.user.id !== id) {
      return res.status(403).json({ message: "Accès refusé." });
    }

    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    await deleteUser(id);
    return res.status(200).json({ message: "Utilisateur supprimé." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getAll, getOne, update, remove };