const {
  createNewsletterEmail,
  getNewsletterEmails,
} = require("../services/newsletter.service");

const subscribeToNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "L'adresse email est obligatoire.",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "L'adresse email n'est pas valide.",
      });
    }

    const newsletterEmail = await createNewsletterEmail(email);

    return res.status(201).json({
      message: "Inscription à la newsletter réussie.",
      data: newsletterEmail,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Cette adresse email est déjà inscrite.",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const getAllNewsletterEmails = async (req, res) => {
  try {
    const emails = await getNewsletterEmails();

    return res.status(200).json({
      data: emails,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

module.exports = {
  subscribeToNewsletter,
  getAllNewsletterEmails,
};