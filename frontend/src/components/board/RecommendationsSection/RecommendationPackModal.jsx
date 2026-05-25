import { useEffect, useMemo } from "react";
import { X } from "lucide-react";
import "./RecommendationPackModal.css";

const sizeOrder = {
  S: 0,
  M: 1,
  L: 2,
};

const formatPrice = (value) => {
  const numericValue = Number(value) || 0;

  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const formatAgeLabel = (ageMin, ageMax) => {
  const min = Number(ageMin);
  const max = Number(ageMax);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return "Tous ages";
  }

  if (min === max) {
    return `${min} ans`;
  }

  return `${min} - ${max} ans`;
};

const getTypeLabel = (productType) => {
  if (productType === "BOARD") {
    return "Planche";
  }

  if (productType === "MODULE") {
    return "Module";
  }

  return "Produit";
};

const sortVariants = (variants = []) =>
  [...variants].sort((first, second) => {
    const firstSize = sizeOrder[first.size] ?? 99;
    const secondSize = sizeOrder[second.size] ?? 99;

    if (firstSize !== secondSize) {
      return firstSize - secondSize;
    }

    return Number(first.price || 0) - Number(second.price || 0);
  });

const sortPackItems = (items = []) =>
  [...items].sort((first, second) => {
    const firstType = first.productVariant?.product?.productType === "BOARD" ? 0 : 1;
    const secondType = second.productVariant?.product?.productType === "BOARD" ? 0 : 1;

    if (firstType !== secondType) {
      return firstType - secondType;
    }

    return (first.productVariant?.product?.name || "").localeCompare(
      second.productVariant?.product?.name || ""
    );
  });

const buildPackItemMeta = (item) => {
  const parts = [
    getTypeLabel(item.productVariant?.product?.productType),
  ];

  if (item.productVariant?.size) {
    parts.push(`Taille ${item.productVariant.size}`);
  }

  if (
    item.productVariant?.product?.productType === "BOARD" &&
    item.productVariant?.holesCount
  ) {
    parts.push(`${item.productVariant.holesCount} trous`);
  }

  if (
    item.productVariant?.product?.productType === "MODULE" &&
    item.productVariant?.holesRequired
  ) {
    parts.push(`${item.productVariant.holesRequired} trous`);
  }

  return parts.join(" - ");
};

function RecommendationPackModal({
  pack,
  isLoading,
  error,
  selectedVariantId,
  onSelectVariant,
  onClose,
  onAddToCart,
  isAddingToCart,
  actionError,
}) {
  useEffect(() => {
    if (!pack && !isLoading && !error) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [error, isLoading, onClose, pack]);

  const sortedVariants = useMemo(
    () => sortVariants(pack?.variants || []),
    [pack]
  );

  const selectedVariant = useMemo(() => {
    if (sortedVariants.length === 0) {
      return null;
    }

    return (
      sortedVariants.find(
        (variant) => String(variant.id) === String(selectedVariantId)
      ) || sortedVariants[0]
    );
  }, [selectedVariantId, sortedVariants]);

  const selectedPackItems = useMemo(
    () => sortPackItems(selectedVariant?.setVariantItems || []),
    [selectedVariant]
  );

  const boardCount = selectedPackItems.reduce(
    (total, item) =>
      total +
      (item.productVariant?.product?.productType === "BOARD" ? item.quantity : 0),
    0
  );
  const moduleCount = selectedPackItems.reduce(
    (total, item) =>
      total +
      (item.productVariant?.product?.productType === "MODULE" ? item.quantity : 0),
    0
  );

  if (!pack && !isLoading && !error) {
    return null;
  }

  return (
    <div
      className="recommendation-pack-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recommendation-pack-modal-title"
      onClick={onClose}
    >
      <div
        className="recommendation-pack-modal__panel"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="recommendation-pack-modal__close"
          onClick={onClose}
          aria-label="Fermer la modale"
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="recommendation-pack-modal__state">
            <p>Chargement du pack...</p>
          </div>
        ) : error ? (
          <div className="recommendation-pack-modal__state">
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="recommendation-pack-modal__hero">
              <div className="recommendation-pack-modal__media">
                {pack?.images?.[0]?.url ? (
                  <img
                    src={pack.images[0].url}
                    alt={pack.name}
                    className="recommendation-pack-modal__image"
                  />
                ) : (
                  <span
                    className="recommendation-pack-modal__placeholder"
                    aria-hidden="true"
                  >
                    {pack?.name?.slice(0, 1).toUpperCase() || "P"}
                  </span>
                )}
              </div>

              <div className="recommendation-pack-modal__intro">
                <div className="recommendation-pack-modal__badges">
                  <span className="recommendation-pack-modal__badge">
                    Pack recommande
                  </span>
                  <span className="recommendation-pack-modal__badge recommendation-pack-modal__badge--soft">
                    {formatAgeLabel(pack?.ageMin, pack?.ageMax)}
                  </span>
                </div>

                <h3
                  className="recommendation-pack-modal__title"
                  id="recommendation-pack-modal-title"
                >
                  {pack?.name}
                </h3>

                <p className="recommendation-pack-modal__description">
                  {pack?.description ||
                    "Une composition prete a l'emploi pour demarrer rapidement."}
                </p>

                <div className="recommendation-pack-modal__summary">
                  <div className="recommendation-pack-modal__summary-item">
                    <span className="recommendation-pack-modal__summary-value">
                      {boardCount}
                    </span>
                    <span className="recommendation-pack-modal__summary-label">
                      planche
                      {boardCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="recommendation-pack-modal__summary-item">
                    <span className="recommendation-pack-modal__summary-value">
                      {moduleCount}
                    </span>
                    <span className="recommendation-pack-modal__summary-label">
                      module
                      {moduleCount > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="recommendation-pack-modal__summary-item">
                    <span className="recommendation-pack-modal__summary-value">
                      {sortedVariants.length}
                    </span>
                    <span className="recommendation-pack-modal__summary-label">
                      variante
                      {sortedVariants.length > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="recommendation-pack-modal__variants">
              <p className="recommendation-pack-modal__section-label">
                Choisir la variante du pack
              </p>

              <div className="recommendation-pack-modal__variant-list">
                {sortedVariants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={`recommendation-pack-modal__variant-btn ${
                      String(variant.id) === String(selectedVariant?.id)
                        ? "recommendation-pack-modal__variant-btn--active"
                        : ""
                    }`}
                    onClick={() => onSelectVariant(String(variant.id))}
                  >
                    <span>Pack {variant.size}</span>
                    <strong>{formatPrice(variant.price)}</strong>
                  </button>
                ))}
              </div>
            </div>

            <div className="recommendation-pack-modal__content">
              <div className="recommendation-pack-modal__content-head">
                <div>
                  <p className="recommendation-pack-modal__section-label">
                    Contenu du pack
                  </p>
                  <h4 className="recommendation-pack-modal__content-title">
                    {selectedVariant ? `Composition ${selectedVariant.size}` : "Composition"}
                  </h4>
                </div>

                {selectedVariant ? (
                  <div className="recommendation-pack-modal__price-block">
                    <span className="recommendation-pack-modal__price-caption">
                      Prix de la variante
                    </span>
                    <strong className="recommendation-pack-modal__price">
                      {formatPrice(selectedVariant.price)}
                    </strong>
                  </div>
                ) : null}
              </div>

              {selectedPackItems.length === 0 ? (
                <p className="recommendation-pack-modal__empty">
                  Ce pack n&apos;a pas encore de composition enregistree.
                </p>
              ) : (
                <div className="recommendation-pack-modal__items">
                  {selectedPackItems.map((item) => {
                    const productName = item.productVariant?.product?.name || "Produit";
                    const productImage =
                      item.productVariant?.product?.images?.[0]?.url || "";

                    return (
                      <article
                        className="recommendation-pack-modal__item"
                        key={item.id}
                      >
                        <div className="recommendation-pack-modal__item-main">
                          <div className="recommendation-pack-modal__item-media">
                            {productImage ? (
                              <img src={productImage} alt={productName} />
                            ) : (
                              <span aria-hidden="true">
                                {productName.slice(0, 1).toUpperCase()}
                              </span>
                            )}
                          </div>

                          <div className="recommendation-pack-modal__item-copy">
                            <p className="recommendation-pack-modal__item-name">
                              {productName}
                            </p>
                            <p className="recommendation-pack-modal__item-meta">
                              {buildPackItemMeta(item)}
                            </p>
                          </div>
                        </div>

                        <div className="recommendation-pack-modal__item-aside">
                          <span className="recommendation-pack-modal__item-quantity">
                            x{item.quantity}
                          </span>
                          <span className="recommendation-pack-modal__item-price">
                            {formatPrice(item.productVariant?.price)}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>

            {actionError ? (
              <p className="recommendation-pack-modal__action-error">
                {actionError}
              </p>
            ) : null}

            <div className="recommendation-pack-modal__footer">
              <div>
                <p className="recommendation-pack-modal__footer-label">
                  Le detail du pack sera visible dans votre panier.
                </p>
                <strong className="recommendation-pack-modal__footer-price">
                  {selectedVariant ? formatPrice(selectedVariant.price) : "-"}
                </strong>
              </div>

              <button
                type="button"
                className="recommendation-pack-modal__cta"
                onClick={() => onAddToCart(selectedVariant)}
                disabled={!selectedVariant || isAddingToCart}
              >
                {isAddingToCart ? "Ajout en cours..." : "Ajouter au panier"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecommendationPackModal;
