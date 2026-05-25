import { useEffect, useMemo, useState } from "react";
import {
  addSetItem,
  deleteSetItem,
  getProductById,
  getProductsAdmin,
} from "../../../services/product.service";
import "./ProductSetItems.css";

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

const compareVariants = (first, second) => {
  const firstSize = sizeOrder[first.size] ?? 99;
  const secondSize = sizeOrder[second.size] ?? 99;

  if (firstSize !== secondSize) {
    return firstSize - secondSize;
  }

  return (first.productName || "").localeCompare(second.productName || "");
};

const normalizeVariant = (variant, product) => ({
  ...variant,
  productName: product?.name || "Produit",
  productType: product?.productType || "",
  productImage: product?.images?.[0]?.url || "",
});

const buildVariantLabel = (variant) => {
  if (!variant) {
    return "Variante inconnue";
  }

  return `${variant.productName} - ${variant.size} (${formatPrice(variant.price)})`;
};

const buildPackVariantLabel = (variant) => {
  if (!variant) {
    return "Variante inconnue";
  }

  return `Pack ${variant.size} - ${formatPrice(variant.price)}`;
};

const extractSetItemsFromPackProduct = (packProduct) => {
  return (packProduct.variants || []).flatMap((variant) =>
    (variant.setVariantItems || []).map((item) => ({
      ...item,
      setVariantId: variant.id,
      setVariant: normalizeVariant(variant, packProduct),
    }))
  );
};

function ProductSetItems({ product }) {
  const [packVariants, setPackVariants] = useState(product.variants || []);
  const [setItems, setSetItems] = useState([]);
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({
    setVariantId: "",
    productVariantId: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const [error, setError] = useState("");

  const variantMap = useMemo(
    () => new Map(variants.map((variant) => [variant.id, variant])),
    [variants]
  );

  const selectedPackVariant = useMemo(
    () =>
      packVariants.find(
        (variant) => variant.id === Number(formData.setVariantId)
      ) || null,
    [formData.setVariantId, packVariants]
  );

  const selectedProductVariant = useMemo(
    () => variantMap.get(Number(formData.productVariantId)) || null,
    [formData.productVariantId, variantMap]
  );

  const selectedPackItemsCount = useMemo(() => {
    if (!selectedPackVariant) {
      return 0;
    }

    return setItems.filter(
      (item) => item.setVariantId === selectedPackVariant.id
    ).length;
  }, [selectedPackVariant, setItems]);

  const groupedSetItems = useMemo(() => {
    return packVariants
      .map((variant) => ({
        variant,
        items: setItems.filter((item) => item.setVariantId === variant.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [packVariants, setItems]);

  const refreshPackContent = async () => {
    try {
      setIsRefreshing(true);
      setError("");

      const [packResponse, productsResponse] = await Promise.all([
        getProductById(product.id),
        getProductsAdmin(),
      ]);

      const packProduct = packResponse.data;
      const adminProducts = productsResponse.data || [];
      const availableVariants = adminProducts
        .flatMap((currentProduct) =>
          (currentProduct.variants || []).map((variant) =>
            normalizeVariant(variant, currentProduct)
          )
        )
        .filter((variant) => variant.productType !== "SET_PREDEFINED")
        .sort(compareVariants);

      const packVariantEntries = (packProduct.variants || [])
        .map((variant) => normalizeVariant(variant, packProduct))
        .sort(compareVariants);
      const packVariantMap = new Map(
        packVariantEntries.map((variant) => [variant.id, variant])
      );
      const availableVariantMap = new Map(
        availableVariants.map((variant) => [variant.id, variant])
      );

      const normalizedSetItems = extractSetItemsFromPackProduct(packProduct).map(
        (item) => {
        const fallbackVariant = item.productVariant
          ? normalizeVariant(item.productVariant, item.productVariant.product)
          : null;

        return {
          ...item,
          setVariant:
            packVariantMap.get(item.setVariantId) || item.setVariant || null,
          productVariant:
            availableVariantMap.get(item.productVariantId) || fallbackVariant,
        };
        }
      );

      setPackVariants(packVariantEntries);
      setVariants(availableVariants);
      setSetItems(normalizedSetItems);

      setFormData((previousFormData) => {
        const hasSelectedPackVariant = packVariantEntries.some(
          (variant) => String(variant.id) === previousFormData.setVariantId
        );
        const hasSelectedProductVariant = availableVariants.some(
          (variant) => String(variant.id) === previousFormData.productVariantId
        );

        return {
          ...previousFormData,
          setVariantId: hasSelectedPackVariant
            ? previousFormData.setVariantId
            : String(packVariantEntries[0]?.id || ""),
          productVariantId: hasSelectedProductVariant
            ? previousFormData.productVariantId
            : "",
        };
      });
    } catch (currentError) {
      console.error(currentError);
      setError(
        currentError.response?.data?.message ||
          "Impossible de charger le contenu du pack."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    void refreshPackContent();
  }, [product]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const setVariantId = Number(formData.setVariantId);
    const productVariantId = Number(formData.productVariantId);
    const quantity = Number(formData.quantity);

    if (!setVariantId || !productVariantId || quantity <= 0) {
      setError("Veuillez choisir une variante du pack, un produit et une quantité valide.");
      return;
    }

    const alreadyExists = setItems.some(
      (item) =>
        item.setVariantId === setVariantId &&
        item.productVariantId === productVariantId
    );

    if (alreadyExists) {
      setError(
        "Cette variante est déjà présente dans ce pack. Retirez-la d'abord si vous voulez la remplacer."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");

      await addSetItem(formData.setVariantId, {
        productVariantId,
        quantity,
      });

      await refreshPackContent();
      setFormData((previousFormData) => ({
        ...previousFormData,
        productVariantId: "",
        quantity: 1,
      }));
    } catch (currentError) {
      console.error(currentError);
      setError(
        currentError.response?.data?.message ||
          "Impossible d'ajouter ce produit au pack."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Retirer ce produit du pack ?")) {
      return;
    }

    try {
      setError("");
      await deleteSetItem(itemId);
      await refreshPackContent();
    } catch (currentError) {
      console.error(currentError);
      setError(
        currentError.response?.data?.message ||
          "Impossible de retirer ce produit du pack."
      );
    }
  };

  return (
    <div className="product-set-items">
      <div className="product-set-items__header">
        <h3>Contenu du pack</h3>
        {isRefreshing ? (
          <span className="product-set-items__status">Actualisation...</span>
        ) : null}
      </div>

      {error ? <p className="product-set-items__error">{error}</p> : null}

      {packVariants.length === 0 ? (
        <p className="set-items-empty">
          Ajoutez d'abord une variante au pack pour pouvoir y associer des
          produits.
        </p>
      ) : groupedSetItems.length === 0 ? (
        <p className="set-items-empty">
          Aucun produit n'a encore été ajouté à ce pack.
        </p>
      ) : (
        <div className="set-items-groups">
          {groupedSetItems.map((group) => (
            <section className="set-items-group" key={group.variant.id}>
              <div className="set-items-group__header">
                <div>
                  <h4 className="set-items-group__title">
                    {buildPackVariantLabel(group.variant)}
                  </h4>
                  <p className="set-items-group__subtitle">
                    {group.items.length} produit
                    {group.items.length > 1 ? "s" : ""} dans cette variante
                  </p>
                </div>

                <span className="set-items-group__badge">
                  Taille {group.variant.size}
                </span>
              </div>

              <div className="set-items-group__list">
                {group.items.map((item) => (
                  <article className="set-item-card" key={item.id}>
                    <div className="set-item-card__main">
                      <div className="set-item-card__media">
                        {item.productVariant?.productImage ? (
                          <img
                            src={item.productVariant.productImage}
                            alt={item.productVariant.productName}
                          />
                        ) : (
                          <span className="set-item-card__placeholder">
                            {item.productVariant?.productName?.slice(0, 1) || "P"}
                          </span>
                        )}
                      </div>

                      <div className="set-item-card__copy">
                        <p className="set-item-card__title">
                          {item.productVariant?.productName || "Produit inconnu"}
                        </p>
                        <p className="set-item-card__subtitle">
                          Taille {item.productVariant?.size || "-"} ·{" "}
                          {formatPrice(item.productVariant?.price)}
                        </p>
                      </div>
                    </div>

                    <div className="set-item-card__aside">
                      <span className="set-item-card__quantity">
                        x{item.quantity}
                      </span>
                      <button
                        type="button"
                        className="btn-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        Retirer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <form className="set-items-form" onSubmit={handleSubmit}>
        <h4>Ajouter un produit au pack</h4>

        <div className="set-items-form__summary">
          {selectedPackVariant ? (
            <span>{buildPackVariantLabel(selectedPackVariant)}</span>
          ) : (
            <span>Choisissez la variante du pack</span>
          )}

          {selectedProductVariant ? (
            <span>{buildVariantLabel(selectedProductVariant)}</span>
          ) : (
            <span>Choisissez le produit à inclure</span>
          )}

          {selectedPackVariant ? (
            <span>{selectedPackItemsCount} élément(s) déjà ajoutés</span>
          ) : null}
        </div>

        <div className="set-items-form__row">
          <div className="set-items-form__field">
            <label>Variante du pack</label>
            <select
              value={formData.setVariantId}
              onChange={(event) =>
                setFormData((previousFormData) => ({
                  ...previousFormData,
                  setVariantId: event.target.value,
                }))
              }
              required
            >
              <option value="">Choisir...</option>
              {packVariants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {buildPackVariantLabel(variant)}
                </option>
              ))}
            </select>
          </div>

          <div className="set-items-form__field">
            <label>Produit à inclure</label>
            <select
              value={formData.productVariantId}
              onChange={(event) =>
                setFormData((previousFormData) => ({
                  ...previousFormData,
                  productVariantId: event.target.value,
                }))
              }
              required
            >
              <option value="">Choisir...</option>
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {buildVariantLabel(variant)}
                </option>
              ))}
            </select>
          </div>

          <div className="set-items-form__field set-items-form__field--quantity">
            <label>Quantité</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(event) =>
                setFormData((previousFormData) => ({
                  ...previousFormData,
                  quantity: event.target.value,
                }))
              }
              min="1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-save"
          disabled={loading || isRefreshing || packVariants.length === 0}
        >
          {loading ? "Ajout..." : "Ajouter au pack"}
        </button>
      </form>
    </div>
  );
}

export default ProductSetItems;

