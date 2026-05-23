import { Link } from "react-router-dom";
import "./CartEmptyState.css";

function CartEmptyState() {
  return (
    <section className="cart-empty-state">
      <div className="cart-empty-state__content">
        <h1 className="cart-empty-state__title">Votre Panier</h1>

        <p className="cart-empty-state__description">
          Vous n&apos;avez encore aucun produit dans votre panier. Composez votre
          planche et ajoutez vos modules pour retrouver ici toute votre
          selection.
        </p>

        <Link to="/la-planche" className="cart-empty-state__action">
          Composer ma planche
        </Link>
      </div>
    </section>
  );
}

export default CartEmptyState;
