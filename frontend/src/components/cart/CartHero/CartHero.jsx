import "./CartHero.css";

function CartHero() {
  return (
    <section className="cart-hero">
      <p className="cart-hero__eyebrow">PANIER</p>
      <h1 className="cart-hero__title">Votre sélection</h1>
      <p className="cart-hero__subtitle">
        Retrouvez ici votre planche et vos modules avant de poursuivre.
      </p>
    </section>
  );
}

export default CartHero;
