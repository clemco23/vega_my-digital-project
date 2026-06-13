import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  Info,
  Leaf,
  Recycle,
  RotateCcw,
  Star,
  Trees,
  Truck,
  X,
} from "lucide-react";
import { getBoards, getModules } from "../../services/product.service";
import { triggerCartAnimation } from "../../services/cart-feedback";
import { addCartItem } from "../../services/cart.service";
import { addWishlistItem } from "../../services/wishlist.service";
import BoardSizeSelector from "./BoardSizeSelector";
import ModuleSelector from "./ModuleSelector";
import "./Configurator.css";

const previewPlacements = [
  { top: "13%", left: "10%", rotate: "-6deg" },
  { top: "17%", left: "48%", rotate: "5deg" },
  { top: "42%", left: "16%", rotate: "3deg" },
  { top: "45%", left: "58%", rotate: "-5deg" },
  { top: "68%", left: "28%", rotate: "6deg" },
  { top: "71%", left: "60%", rotate: "-2deg" },
];

const benefitItems = [
  {
    icon: Truck,
    label: "Livraison et retour gratuits",
  },
  {
    icon: RotateCcw,
    label: "Retour gratuit sous 30 jours",
  },
  {
    icon: Recycle,
    label: "Revendez vos articles",
    trailingIcon: Info,
  },
];

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Normes CE",
    text: "Sécurité certifiée",
  },
  {
    icon: Trees,
    title: "Bois FSC",
    text: "Gestion durable",
  },
  {
    icon: Leaf,
    title: "Artisanat",
    text: "Fait main en France",
  },
];

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

const getBoardSizeModifier = (size) => {
  if (size === "S") return "small";
  if (size === "L") return "large";
  return "medium";
};

const getHoleLayout = (holesCount) => {
  if (holesCount <= 6) {
    return { columns: 3, rows: 2 };
  }

  if (holesCount <= 10) {
    return { columns: 5, rows: 2 };
  }

  if (holesCount <= 12) {
    return { columns: 4, rows: 3 };
  }

  if (holesCount <= 15) {
    return { columns: 5, rows: 3 };
  }

  if (holesCount <= 20) {
    return { columns: 5, rows: 4 };
  }

  const columns = Math.min(6, Math.max(4, Math.ceil(Math.sqrt(holesCount))));

  return {
    columns,
    rows: Math.ceil(holesCount / columns),
  };
};

const getPreviewModuleLabel = (name) => {
  if (!name) return "Module";

  if (name.length <= 18) {
    return name;
  }

  return name.split(" ").slice(0, 2).join(" ");
};

const getProductImageUrl = (product) => {
  return product?.images?.[0]?.url || "";
};

function Configurator() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [modules, setModules] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [expandedPreviewModule, setExpandedPreviewModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addingToWishlist, setAddingToWishlist] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardsData, modulesData] = await Promise.all([
          getBoards(),
          getModules(),
        ]);

        setBoards(boardsData.data);
        setModules(modulesData.data);

        if (boardsData.data.length > 0) {
          const firstBoard = boardsData.data[0];
          const sortedVariants = [...firstBoard.variants].sort(
            (first, second) =>
              (sizeOrder[first.size] ?? 99) - (sizeOrder[second.size] ?? 99)
          );
          const defaultVariant =
            sortedVariants.find((variant) => variant.size === "S") ||
            sortedVariants[0];

          if (defaultVariant) {
            setSelectedBoard({ product: firstBoard, variant: defaultVariant });
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    if (!expandedPreviewModule) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setExpandedPreviewModule(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [expandedPreviewModule]);

  const handleSelectSize = (variant) => {
    setSelectedBoard({ product: boards[0], variant });
    setSelectedModules([]);
    setExpandedPreviewModule(null);
  };

  const handleToggleModule = (variant, product) => {
    const alreadySelected = selectedModules.find(
      (module) => module.variant.id === variant.id
    );

    if (alreadySelected) {
      setExpandedPreviewModule((currentModule) =>
        currentModule?.variant.id === variant.id ? null : currentModule
      );
      setSelectedModules((previousModules) =>
        previousModules.filter((module) => module.variant.id !== variant.id)
      );
      return;
    }

    const usedHoles = selectedModules.reduce(
      (accumulator, module) => accumulator + (module.variant.holesRequired || 0),
      0
    );
    const remainingHoles =
      (selectedBoard?.variant.holesCount || 0) - usedHoles;

    if ((variant.holesRequired || 0) > remainingHoles) {
      return;
    }

    setSelectedModules((previousModules) => [
      ...previousModules,
      { variant, product },
    ]);
  };

  const usedHoles = selectedModules.reduce(
    (accumulator, module) => accumulator + (module.variant.holesRequired || 0),
    0
  );
  const remainingHoles =
    (selectedBoard?.variant.holesCount || 0) - usedHoles;
  const totalPrice =
    Number(selectedBoard?.variant.price || 0) +
    selectedModules.reduce(
      (accumulator, module) => accumulator + Number(module.variant.price || 0),
      0
    );

  const boardSizeModifier = getBoardSizeModifier(selectedBoard?.variant?.size);
  const holeLayout = getHoleLayout(selectedBoard?.variant?.holesCount || 0);
  const holeItems = Array.from(
    { length: selectedBoard?.variant?.holesCount || 0 },
    (_, index) => index
  );
  const previewModules = selectedModules.slice(0, previewPlacements.length);
  const showEmptyPreviewHint = previewModules.length === 0;
  const selectionVariantIds = [
    selectedBoard?.variant?.id,
    ...selectedModules.map((module) => module.variant.id),
  ].filter(Boolean);
  const expandedPreviewImageUrl = getProductImageUrl(
    expandedPreviewModule?.product
  );

  const renderBoardPreview = (className = "") => (
    <div className={["configurator__preview-card", className].join(" ").trim()}>
      <div
        className={`configurator__board configurator__board--${boardSizeModifier}`}
      >
        <div className="configurator__board-surface">
          <div
            className="configurator__board-holes"
            style={{
              "--board-columns": String(holeLayout.columns),
              "--board-rows": String(holeLayout.rows),
            }}
          >
            {holeItems.map((holeIndex) => (
              <span
                key={`board-hole-${holeIndex}`}
                className={`configurator__board-hole ${holeIndex < usedHoles ? "configurator__board-hole--used" : ""}`}
              />
            ))}
          </div>

          {previewModules.length > 0 ? (
            <div className="configurator__board-modules">
              {previewModules.map((module, index) => {
                const placement = previewPlacements[index];
                const span = Math.min(
                  Math.max(module.variant.holesRequired || 1, 1),
                  4
                );
                const imageUrl = getProductImageUrl(module.product);

                return (
                  <button
                    type="button"
                    key={`preview-module-${module.variant.id}`}
                    className={`configurator__board-module configurator__board-module--span-${span}`}
                    style={{
                      "--module-top": placement.top,
                      "--module-left": placement.left,
                      "--module-rotate": placement.rotate,
                    }}
                    onClick={() => setExpandedPreviewModule(module)}
                    aria-label={`Voir ${module.product.name} en grand`}
                    title={`Voir ${module.product.name} en grand`}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={module.product.name}
                        className="configurator__board-module-image"
                      />
                    ) : (
                      <span className="configurator__board-module-name">
                        {getPreviewModuleLabel(module.product.name)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : null}

          <span className="configurator__board-brand">HAPTO</span>
        </div>
      </div>

      {showEmptyPreviewHint ? (
        <p className="configurator__board-empty-note">
          Sélectionnez vos modules pour visualiser la composition.
        </p>
      ) : null}
    </div>
  );

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      setActionError("");

      await addCartItem(selectedBoard.variant.id);

      for (const module of selectedModules) {
        await addCartItem(module.variant.id);
      }

      triggerCartAnimation();
      navigate("/panier");
    } catch (error) {
      console.error(error);
      setActionError(
        error.response?.data?.message ||
          "Impossible d'ajouter cette selection au panier."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setAddingToWishlist(true);
      setActionError("");

      for (const variantId of selectionVariantIds) {
        try {
          await addWishlistItem(variantId);
        } catch (error) {
          if (error.response?.status === 409) {
            continue;
          }

          throw error;
        }
      }

      navigate("/favoris");
    } catch (error) {
      console.error(error);
      setActionError(
        error.response?.data?.message ||
          "Impossible d'ajouter cette selection aux favoris."
      );
    } finally {
      setAddingToWishlist(false);
    }
  };

  if (loading) {
    return (
      <section className="configurator configurator--loading">
        <p className="configurator-loading">Chargement...</p>
      </section>
    );
  }

  if (!selectedBoard) {
    return (
      <section className="configurator configurator--loading">
        <p className="configurator-loading">
          Aucune planche n&apos;est disponible pour le moment.
        </p>
      </section>
    );
  }

  return (
    <section className="configurator" id="configurator">
      <div className="configurator__inner">
        <div className="configurator__left">
          <header className="configurator__header">
            <h1 className="configurator__title">La planche sensorielle</h1>

            <p className="configurator__subtitle">
              Choisissez la taille de la planche que vous souhaitez et les
              modules que vous voulez y intégrer.
            </p>

            {renderBoardPreview("configurator__preview-card--mobile")}

            <div className="configurator__rating" aria-label="Note 4,8 sur 5">
              <div className="configurator__stars" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`configurator-star-${index}`}
                    className="configurator__star"
                    fill="currentColor"
                  />
                ))}
              </div>
              <span>4.8 / 5.0 | 124 commentaires</span>
            </div>

            <p className="configurator__price">{formatPrice(totalPrice)}</p>
          </header>

          <div className="configurator__section">
            <BoardSizeSelector
              boards={boards}
              selectedVariant={selectedBoard.variant}
              onSelect={handleSelectSize}
            />

            <p className="configurator__holes">
              Trous disponibles : <strong>{remainingHoles}</strong> /{" "}
              {selectedBoard.variant.holesCount}
            </p>
          </div>

          <div className="configurator__section">
            <ModuleSelector
              modules={modules}
              selectedBoard={selectedBoard}
              selectedModules={selectedModules}
              onToggle={handleToggleModule}
            />
          </div>

          <div className="configurator__actions">
            <button
              type="button"
              className="configurator__btn"
              onClick={handleAddToCart}
              disabled={!selectedBoard || addingToCart || addingToWishlist}
            >
              {addingToCart ? "Ajout en cours..." : "Ajouter au panier"}
            </button>

            <button
              type="button"
              className="configurator__btn configurator__btn--secondary"
              onClick={handleAddToWishlist}
              disabled={!selectedBoard || addingToCart || addingToWishlist}
            >
              {addingToWishlist
                ? "Sauvegarde..."
                : "Ajouter aux favoris"}
            </button>
          </div>

          {actionError ? (
            <p className="configurator__feedback" role="alert">
              {actionError}
            </p>
          ) : null}
        </div>

        <div className="configurator__right">
          {renderBoardPreview("configurator__preview-card--desktop")}

          <div className="configurator__benefits">
            {benefitItems.map((item) => {
              const Icon = item.icon;
              const TrailingIcon = item.trailingIcon;

              return (
                <div className="configurator__benefit" key={item.label}>
                  <div className="configurator__benefit-main">
                    <Icon className="configurator__benefit-icon" />
                    <span>{item.label}</span>
                  </div>

                  {TrailingIcon ? (
                    <TrailingIcon className="configurator__benefit-icon configurator__benefit-icon--muted" />
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="configurator__trust-strip" aria-label="Engagements produit">
            {trustItems.map((item) => {
              const Icon = item.icon;

              return (
                <article className="configurator__trust-item" key={item.title}>
                  <span className="configurator__trust-icon-wrap" aria-hidden="true">
                    <Icon className="configurator__trust-icon" />
                  </span>
                  <div className="configurator__trust-copy">
                    <p className="configurator__trust-title">{item.title}</p>
                    <p className="configurator__trust-text">{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {expandedPreviewModule ? (
        <div
          className="configurator__module-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="configurator-module-lightbox-title"
          onClick={() => setExpandedPreviewModule(null)}
        >
          <div
            className="configurator__module-lightbox-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="configurator__module-lightbox-close"
              onClick={() => setExpandedPreviewModule(null)}
              aria-label="Fermer l'aperçu du module"
            >
              <X size={20} />
            </button>

            <div className="configurator__module-lightbox-media">
              {expandedPreviewImageUrl ? (
                <img
                  src={expandedPreviewImageUrl}
                  alt={expandedPreviewModule.product.name}
                  className="configurator__module-lightbox-image"
                />
              ) : (
                <span
                  className="configurator__module-lightbox-placeholder"
                  aria-hidden="true"
                >
                  {expandedPreviewModule.product.name
                    .slice(0, 1)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <div className="configurator__module-lightbox-copy">
              <p className="configurator__module-lightbox-eyebrow">
                Module selectionne
              </p>
              <h2
                className="configurator__module-lightbox-title"
                id="configurator-module-lightbox-title"
              >
                {expandedPreviewModule.product.name}
              </h2>
              <p className="configurator__module-lightbox-meta">
                {expandedPreviewModule.variant.holesRequired} trou
                {expandedPreviewModule.variant.holesRequired > 1 ? "s" : ""} sur
                la planche
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default Configurator;
