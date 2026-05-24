const resend = require("../config/resend");

const sendVerificationEmail = async (email, token) => {
  await resend.emails.send({
    from: "noreply@haptokids.fr",
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
      from: "noreply@haptokids.fr",
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
  const sendOrderConfirmationEmail = async (email, order) => {
    await resend.emails.send({
      from: "noreply@haptokids.fr",
      to: email,
      subject: `Confirmation de votre commande #${order.id}`,
      html: `
        <h1>Merci pour votre commande !</h1>
        <p>Votre commande <strong>#${order.id}</strong> a bien été payée.</p>
        <h2>Récapitulatif :</h2>
        <ul>
          ${order.orderVariants.map((ov) => `
            <li>
              <strong>${ov.productVariant.product.name}</strong> - Taille ${ov.productVariant.size} 
              x${ov.quantity} → ${ov.productVariant.price}€
            </li>
          `).join("")}
        </ul>
        <p><strong>Total : ${order.totalAmount}€</strong></p>
        <p>Adresse de livraison : ${order.customerStreet}, ${order.customerCity} ${order.customerPostalCode}</p>
        <p>Merci de votre confiance !</p>
      `,
    });
  };
  
  module.exports = { 
    sendVerificationEmail, 
    sendResetPasswordEmail,
    sendOrderConfirmationEmail,
  };

