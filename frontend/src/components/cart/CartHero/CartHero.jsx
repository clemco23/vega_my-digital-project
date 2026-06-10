import CartViewTabs from "../CartViewTabs/CartViewTabs";
import "./CartHero.css";

function CartHero({ mode = "cart" }) {
  const isWishlist = mode === "wishlist";

  return (
    <section className="cart-hero">
      <CartViewTabs mode={mode} />
      <p className="cart-hero__eyebrow">{isWishlist ? "FAVORIS" : "PANIER"}</p>
      <h1 className="cart-hero__title">
        {isWishlist ? "Vos envies sauvegardees" : "Votre selection"}
      </h1>
      <p className="cart-hero__subtitle">
        {isWishlist
          ? "Gardez ici vos modules et votre planche preferes, puis ajoutez-les au panier quand vous le souhaitez."
          : "Retrouvez ici votre planche et vos modules avant de poursuivre."}
      </p>
    </section>
  );
}

export default CartHero;
