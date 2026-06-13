import { useEffect, useState } from "react";
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
  subtotalAmount,
  discountAmount = "0.00",
  totalAmount,
  promoCode,
  promoFeedback,
  isApplyingPromo,
  isRemovingPromo,
  shippingAddress,
  addressMessage,
  isLoadingAddress,
  isPrimaryLoading,
  isClearing,
  onPrimaryAction,
  onClear,
  onApplyPromoCode,
  onRemovePromoCode,
}) {
  const isWishlist = mode === "wishlist";
  const { streetLine, extraLine } = getAddressParts(shippingAddress);
  const [promoInput, setPromoInput] = useState(promoCode?.code || "");

  useEffect(() => {
    setPromoInput(promoCode?.code || "");
  }, [promoCode?.code]);

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
    : isPrimaryLoading ||
      isLoadingAddress ||
      !shippingAddress ||
      isApplyingPromo ||
      isRemovingPromo;

  const promoActionDisabled =
    isApplyingPromo || isRemovingPromo || promoInput.trim().length === 0;
  const hasDiscount = Number(discountAmount) > 0;
  const hasPromoCode = Boolean(promoCode?.code);

  const handlePromoSubmit = (event) => {
    event.preventDefault();

    if (promoActionDisabled || !onApplyPromoCode) {
      return;
    }

    onApplyPromoCode(promoInput.trim());
  };

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

      {!isWishlist ? (
        <>
          <div className="cart-summary__row">
            <span>Sous-total</span>
            <strong>{formatPrice(subtotalAmount)}</strong>
          </div>

          {hasDiscount ? (
            <div className="cart-summary__row cart-summary__row--discount">
              <span>
                Remise {hasPromoCode ? `(${promoCode.code})` : ""}
              </span>
              <strong>-{formatPrice(discountAmount)}</strong>
            </div>
          ) : null}
        </>
      ) : null}

      <div className="cart-summary__row cart-summary__row--total">
        <span>Total</span>
        <strong>{formatPrice(totalAmount)}</strong>
      </div>

      <p className="cart-summary__note">
        {isWishlist
          ? "Conservez cette selection de cote et ajoutez-la au panier quand vous etes pret."
          : "Vous pouvez revenir dans le configurateur a tout moment pour modifier votre composition."}
      </p>

      {!isWishlist ? (
        <div className="cart-summary__promo">
          <div className="cart-summary__promo-head">
            <span>Code promo</span>
            {hasPromoCode ? (
              <button
                type="button"
                className="cart-summary__promo-remove"
                onClick={onRemovePromoCode}
                disabled={isRemovingPromo || isApplyingPromo}
              >
                {isRemovingPromo ? "Retrait..." : "Retirer"}
              </button>
            ) : null}
          </div>

          <form className="cart-summary__promo-form" onSubmit={handlePromoSubmit}>
            <input
              type="text"
              className="cart-summary__promo-input"
              placeholder="Ex: BIENVENUE10"
              value={promoInput}
              onChange={(event) => setPromoInput(event.target.value.toUpperCase())}
              disabled={isApplyingPromo || isRemovingPromo}
            />
            <button
              type="submit"
              className="cart-summary__promo-button"
              disabled={promoActionDisabled}
            >
              {isApplyingPromo ? "Application..." : hasPromoCode ? "Mettre a jour" : "Appliquer"}
            </button>
          </form>

          {hasPromoCode ? (
            <p className="cart-summary__promo-active">
              Code actif : <strong>{promoCode.code}</strong>
            </p>
          ) : null}

          {promoFeedback?.message ? (
            <p
              className={`cart-summary__promo-feedback cart-summary__promo-feedback--${promoFeedback.type || "info"}`}
            >
              {promoFeedback.message}
            </p>
          ) : null}
        </div>
      ) : null}

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
