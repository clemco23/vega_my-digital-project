import { Link } from "react-router-dom";
import { formatPrice } from "../cart.utils";
import "./CartSummary.css";

const getAddressParts = (address) => {
  if (!address) {
    return { streetLine: "", extraLine: "" };
  }

  const [streetLine = "", extraLine = ""] = (address.street || "")
    .split("|")
    .map((value) => value.trim());

  return { streetLine, extraLine };
};

function CartSummary({
  totalItems,
  totalAmount,
  shippingAddress,
  addressMessage,
  isLoadingAddress,
  isCreatingOrder,
  isClearing,
  onCheckout,
  onClear,
}) {
  const { streetLine, extraLine } = getAddressParts(shippingAddress);

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

      <div className="cart-summary__address-block">
        <div className="cart-summary__address-header">
          <span>Adresse de livraison</span>
          <Link to="/profil" className="cart-summary__address-link">
            Modifier
          </Link>
        </div>

        {isLoadingAddress ? (
          <p className="cart-summary__address-note">
            Chargement de votre adresse...
          </p>
        ) : shippingAddress ? (
          <div className="cart-summary__address-card">
            <strong>{streetLine || "Adresse renseignee"}</strong>
            {extraLine ? <span>{extraLine}</span> : null}
            <span>
              {shippingAddress.postalCode} {shippingAddress.city}
            </span>
            <span>{shippingAddress.country || "France"}</span>
          </div>
        ) : (
          <p className="cart-summary__address-note">
            {addressMessage || "Aucune adresse de livraison enregistree."}
          </p>
        )}
      </div>

      <div className="cart-summary__actions">
        <button
          type="button"
          className="cart-summary__primary-button"
          onClick={onCheckout}
          disabled={isCreatingOrder || isLoadingAddress || !shippingAddress}
        >
          {isCreatingOrder ? "Redirection..." : "Valider et payer"}
        </button>

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
