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

const sendResetPasswordEmail = async (email, token) => {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <h1>Réinitialisation du mot de passe</h1>
        <p>Voici votre code de réinitialisation :</p>
        <h2>${token}</h2>
        <p>Ce code expire dans 24h.</p>
        <p>Si vous n'avez pas demandé de réinitialisation, ignorez cet email.</p>
      `,
    });
  };

module.exports = { sendVerificationEmail, sendResetPasswordEmail };