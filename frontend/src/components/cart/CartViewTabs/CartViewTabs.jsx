import { Link } from "react-router-dom";
import "./CartViewTabs.css";

function CartViewTabs({ mode = "cart" }) {
  return (
    <nav className="cart-view-tabs" aria-label="Navigation de votre selection">
      <Link
        to="/panier"
        className={`cart-view-tabs__link ${mode === "cart" ? "cart-view-tabs__link--active" : ""}`}
      >
        Panier
      </Link>

      <Link
        to="/favoris"
        className={`cart-view-tabs__link ${mode === "wishlist" ? "cart-view-tabs__link--active" : ""}`}
      >
        Favoris
      </Link>
    </nav>
  );
}

export default CartViewTabs;
