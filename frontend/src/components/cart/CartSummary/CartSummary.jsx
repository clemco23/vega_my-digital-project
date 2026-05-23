import { Link } from "react-router-dom";
import { formatPrice } from "../cart.utils";
import "./CartSummary.css";

function CartSummary({ totalItems, totalAmount, isClearing, onClear }) {
  return (
    <aside className="cart-summary">
      <p className="cart-summary__eyebrow">Recapitulatif</p>
      <h2 className="cart-summary__title">Votre panier est sauvegarde</h2>

      <div className="cart-summary__row">
        <span>Articles</span>
        <strong>{totalItems}</strong>
      </div>

      <div className="cart-summary__row">
        <span>Total</span>
        <strong>{formatPrice(totalAmount)}</strong>
      </div>

      <p className="cart-summary__note">
        Vous pouvez revenir dans le configurateur a tout moment pour modifier
        votre composition.
      </p>

      <div className="cart-summary__actions">
        <Link to="/la-planche" className="cart-summary__link">
          Continuer ma selection
        </Link>

        <button
          type="button"
          className="cart-summary__danger-button"
          onClick={onClear}
          disabled={isClearing}
        >
          {isClearing ? "Vidage en cours..." : "Vider le panier"}
        </button>
      </div>
    </aside>
  );
}

export default CartSummary;
