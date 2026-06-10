import { Link } from "react-router-dom";
import CartViewTabs from "../CartViewTabs/CartViewTabs";
import "./CartEmptyState.css";

function CartEmptyState({ mode = "cart" }) {
  const isWishlist = mode === "wishlist";

  return (
    <section className="cart-empty-state">
      <div className="cart-empty-state__content">
        <CartViewTabs mode={mode} />
        <h1 className="cart-empty-state__title">
          {isWishlist ? "Vos favoris" : "Votre panier"}
        </h1>

        <p className="cart-empty-state__description">
          {isWishlist
            ? "Vous n'avez encore aucun produit dans vos favoris. Composez votre planche et sauvegardez vos modules pour les retrouver ici."
            : "Vous n'avez encore aucun produit dans votre panier. Composez votre planche et ajoutez vos modules pour retrouver ici toute votre selection."}
        </p>

        <Link to="/la-planche" className="cart-empty-state__action">
          Composer ma planche
        </Link>
      </div>
    </section>
  );
}

export default CartEmptyState;
