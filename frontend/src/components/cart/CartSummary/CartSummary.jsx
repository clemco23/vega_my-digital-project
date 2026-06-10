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
  mode = "cart",
  totalItems,
  totalAmount,
  shippingAddress,
  addressMessage,
  isLoadingAddress,
  isPrimaryLoading,
  isClearing,
  onPrimaryAction,
  onClear,
}) {
  const isWishlist = mode === "wishlist";
  const { streetLine, extraLine } = getAddressParts(shippingAddress);

  const primaryLabel = isWishlist
    ? isPrimaryLoading
      ? "Ajout en cours..."
      : "Tout ajouter au panier"
    : isPrimaryLoading
      ? "Redirection..."
      : "Valider et payer";

  const clearLabel = isClearing
    ? "Vidage en cours..."
    : isWishlist
      ? "Vider les favoris"
      : "Vider le panier";

  const primaryDisabled = isWishlist
    ? isPrimaryLoading || totalItems === 0
    : isPrimaryLoading || isLoadingAddress || !shippingAddress;

  return (
    <aside className="cart-summary">
      <p className="cart-summary__eyebrow">
        {isWishlist ? "Favoris" : "Recapitulatif"}
      </p>
      <h2 className="cart-summary__title">
        {isWishlist
          ? "Vos favoris sont sauvegardes"
          : "Votre panier est sauvegarde"}
      </h2>

      <div className="cart-summary__row">
        <span>Articles</span>
        <strong>{totalItems}</strong>
      </div>

      <div className="cart-summary__row">
        <span>Total</span>
        <strong>{formatPrice(totalAmount)}</strong>
      </div>

      <p className="cart-summary__note">
        {isWishlist
          ? "Conservez cette selection de cote et ajoutez-la au panier quand vous etes pret."
          : "Vous pouvez revenir dans le configurateur a tout moment pour modifier votre composition."}
      </p>

      {!isWishlist ? (
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
      ) : null}

      <div className="cart-summary__actions">
        <button
          type="button"
          className="cart-summary__primary-button"
          onClick={onPrimaryAction}
          disabled={primaryDisabled}
        >
          {primaryLabel}
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
          {clearLabel}
        </button>
      </div>
    </aside>
  );
}

export default CartSummary;
