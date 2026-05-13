const resend = require("../config/resend");

const sendVerificationEmail = async (email, token) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Vérification de votre adresse email",
    html: `
      <h1>Bienvenue !</h1>
      <p>Voici votre code de vérification :</p>
      <h2>${token}</h2>
      <p>Ce code expire dans 24h.</p>
    `,
  });
};

module.exports = { sendVerificationEmail };