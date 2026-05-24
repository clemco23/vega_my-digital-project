const { getStats } = require("../services/stats.service");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await getStats();
    return res.status(200).json({ data: stats });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = { getDashboardStats };