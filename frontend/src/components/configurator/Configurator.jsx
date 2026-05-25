import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info, Recycle, RotateCcw, Star, Truck } from "lucide-react";
import { getBoards, getModules } from "../../services/product.service";
import { triggerCartAnimation } from "../../services/cart-feedback";
import { addCartItem } from "../../services/cart.service";
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
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

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

  const handleSelectSize = (variant) => {
    setSelectedBoard({ product: boards[0], variant });
    setSelectedModules([]);
  };

  const handleToggleModule = (variant, product) => {
    const alreadySelected = selectedModules.find(
      (module) => module.variant.id === variant.id
    );

    if (alreadySelected) {
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
                  <div
                    key={`preview-module-${module.variant.id}`}
                    className={`configurator__board-module configurator__board-module--span-${span}`}
                    style={{
                      "--module-top": placement.top,
                      "--module-left": placement.left,
                      "--module-rotate": placement.rotate,
                    }}
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
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="configurator__board-empty">
              Selectionnez vos modules pour visualiser la composition.
            </p>
          )}

          <span className="configurator__board-brand">HAPTO</span>
        </div>
      </div>
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

      await addCartItem(selectedBoard.variant.id);

      for (const module of selectedModules) {
        await addCartItem(module.variant.id);
      }

      triggerCartAnimation();
      navigate("/panier");
    } catch (error) {
      console.error(error);
    } finally {
      setAddingToCart(false);
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
              modules que vous voulez y integrer.
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

          <button
            type="button"
            className="configurator__btn"
            onClick={handleAddToCart}
            disabled={!selectedBoard || addingToCart}
          >
            {addingToCart ? "Ajout en cours..." : "Ajouter au panier"}
          </button>
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
        </div>
      </div>
    </section>
  );
}

export default Configurator;
