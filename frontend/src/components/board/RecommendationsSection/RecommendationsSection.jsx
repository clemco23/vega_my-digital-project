import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../../assets/hero.png";
import imgHomeImage from "../../../assets/img_home.png";
import toolImage from "../../../assets/tool.png";
import { triggerCartAnimation } from "../../../services/cart-feedback";
import { addCartItem } from "../../../services/cart.service";
import {
  getPredefinedSets,
  getProductById,
} from "../../../services/product.service";
import RecommendationPackModal from "./RecommendationPackModal";
import "./RecommendationsSection.css";

const fallbackImages = [heroImage, imgHomeImage, toolImage];

const fallbackRecommendations = [
  {
    id: "fallback-eveil",
    image: heroImage,
    eyebrow: "Eveil",
    ageLabel: "2 ans et +",
    title: "Planche d'eveil",
    description:
      "Une combinaison douce pour faire decouvrir textures, sons et gestes du quotidien.",
    priceLabel: "XX EUR",
  },
  {
    id: "fallback-motricite",
    image: imgHomeImage,
    eyebrow: "Motricite",
    ageLabel: "2 - 4 ans",
    title: "Planche de motricite",
    description:
      "Des modules choisis pour encourager precision, coordination et autonomie.",
    priceLabel: "XX EUR",
  },
  {
    id: "fallback-apaisement",
    image: toolImage,
    eyebrow: "Apaisement",
    ageLabel: "4 ans et +",
    title: "Planche d'apaisement",
    description:
      "Une selection tactile et repetitive qui aide l'enfant a se recentrer et se calmer.",
    priceLabel: "XX EUR",
  },
];

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

const getPrimaryImage = (product, index) =>
  product?.images?.[0]?.url || fallbackImages[index % fallbackImages.length];

const getEyebrow = (product, index) => {
  const skillLabel = product?.skills?.[0]?.skill?.label;

  if (skillLabel) {
    return skillLabel;
  }

  return fallbackRecommendations[index % fallbackRecommendations.length].eyebrow;
};

const getRecommendationDescription = (product, index) => {
  if (product?.description?.trim()) {
    return product.description.trim();
  }

  return fallbackRecommendations[index % fallbackRecommendations.length].description;
};

const getRecommendationPrice = (product) => {
  const prices = (product?.variants || [])
    .map((variant) => Number(variant.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (prices.length === 0) {
    return "XX EUR";
  }

  return formatPrice(Math.min(...prices));
};

function RecommendationsSection() {
  const navigate = useNavigate();
  const [packs, setPacks] = useState([]);
  const [packDetailsById, setPackDetailsById] = useState({});
  const [openedPackId, setOpenedPackId] = useState(null);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [isLoadingPack, setIsLoadingPack] = useState(false);
  const [packLoadError, setPackLoadError] = useState("");
  const [packActionError, setPackActionError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const data = await getPredefinedSets();
        setPacks(data.data || []);
      } catch (error) {
        console.error("Impossible de charger les recommandations :", error);
      }
    };

    void fetchPacks();
  }, []);

  const recommendationCards = useMemo(() => {
    const liveCards = packs.slice(0, 3).map((product, index) => ({
      id: product.id,
      productId: product.id,
      image: getPrimaryImage(product, index),
      eyebrow: getEyebrow(product, index),
      ageLabel: formatAgeLabel(product.ageMin, product.ageMax),
      title: product.name,
      description: getRecommendationDescription(product, index),
      priceLabel: getRecommendationPrice(product),
      canOpenDetails: (product.variants || []).length > 0,
    }));

    if (liveCards.length >= 3) {
      return liveCards;
    }

    return [
      ...liveCards,
      ...fallbackRecommendations.slice(liveCards.length, 3).map((card) => ({
        ...card,
        productId: null,
        canOpenDetails: false,
      })),
    ];
  }, [packs]);

  const selectedPack = openedPackId ? packDetailsById[openedPackId] || null : null;

  const closeModal = () => {
    setOpenedPackId(null);
    setSelectedVariantId("");
    setPackLoadError("");
    setPackActionError("");
    setIsLoadingPack(false);
  };

  const handleOpenDetails = async (productId) => {
    if (!productId) {
      navigate("/planche#configurator");
      return;
    }

    setOpenedPackId(productId);
    setPackLoadError("");
    setPackActionError("");

    const cachedPack = packDetailsById[productId];

    if (cachedPack) {
      setSelectedVariantId(String(cachedPack.variants?.[0]?.id || ""));
      return;
    }

    try {
      setIsLoadingPack(true);
      const response = await getProductById(productId);
      const packProduct = response.data;

      setPackDetailsById((previous) => ({
        ...previous,
        [productId]: packProduct,
      }));
      setSelectedVariantId(String(packProduct.variants?.[0]?.id || ""));
    } catch (error) {
      console.error(error);
      setPackLoadError(
        error.response?.data?.message ||
          "Impossible de charger le detail de ce pack."
      );
    } finally {
      setIsLoadingPack(false);
    }
  };

  const handleAddPackToCart = async (variant) => {
    if (!variant?.id) {
      setPackActionError("Choisissez une variante de pack valide.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setIsAddingToCart(true);
      setPackActionError("");
      await addCartItem(variant.id);
      triggerCartAnimation();
      closeModal();
      navigate("/panier");
    } catch (error) {
      console.error(error);
      setPackActionError(
        error.response?.data?.message ||
          "Impossible d'ajouter ce pack au panier."
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <>
      <section
        className="recommendations-section"
        aria-labelledby="recommendations-title"
      >
        <div className="recommendations-section__inner">
          <div className="recommendations-section__heading">
            <h2
              className="recommendations-section__title"
              id="recommendations-title"
            >
              Nos recommandations
            </h2>
            <p className="recommendations-section__subtitle">
              Vous n&apos;avez pas d&apos;inspiration ? Laissez-nous vous proposer
              les meilleures combinaisons.
            </p>
          </div>

          <div className="recommendations-section__grid">
            {recommendationCards.map((card) => (
              <article className="recommendation-card" key={card.id}>
                <div className="recommendation-card__image-wrap">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="recommendation-card__image"
                  />
                </div>

                <div className="recommendation-card__content">
                  <div className="recommendation-card__meta">
                    <span className="recommendation-card__eyebrow">
                      {card.eyebrow}
                    </span>
                    <span className="recommendation-card__age">
                      {card.ageLabel}
                    </span>
                  </div>

                  <h3 className="recommendation-card__title">{card.title}</h3>
                  <p className="recommendation-card__description">
                    {card.description}
                  </p>

                  <div className="recommendation-card__footer">
                    <span className="recommendation-card__price">
                      {card.priceLabel}
                    </span>

                    {card.canOpenDetails ? (
                      <button
                        type="button"
                        className="recommendation-card__button"
                        onClick={() => handleOpenDetails(card.productId)}
                      >
                        Voir details
                      </button>
                    ) : (
                      <a
                        className="recommendation-card__button"
                        href="#configurator"
                      >
                        Decouvrir
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {openedPackId ? (
        <RecommendationPackModal
          pack={selectedPack}
          isLoading={isLoadingPack}
          error={packLoadError}
          selectedVariantId={selectedVariantId}
          onSelectVariant={setSelectedVariantId}
          onClose={closeModal}
          onAddToCart={handleAddPackToCart}
          isAddingToCart={isAddingToCart}
          actionError={packActionError}
        />
      ) : null}
    </>
  );
}

export default RecommendationsSection;
