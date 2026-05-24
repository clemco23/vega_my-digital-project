import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "../../../services/product.service";
import ProductVariants from "./ProductVariants";
import ProductImages from "./ProductImages";
import ProductSetItems from "./ProductSetItems";
import "./ProductForm.css";

function ProductForm({ product, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    productType: "BOARD",
    ageMin: "",
    ageMax: "",
    isActivated: false,
    variants: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedProduct, setSavedProduct] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || "",
        productType: product.productType,
        ageMin: product.ageMin,
        ageMax: product.ageMax,
        isActivated: product.isActivated,
        variants: [],
      });
      setSavedProduct(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: "S", price: "", stock: "", holesCount: "", holesRequired: "" },
      ],
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData((prev) => {
      const variants = [...prev.variants];
      variants[index] = { ...variants[index], [field]: value };
      return { ...prev, variants };
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.variants.length === 0 && !product) {
      setError("Ajoutez au moins une variante.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        description: formData.description,
        productType: formData.productType,
        ageMin: parseInt(formData.ageMin),
        ageMax: parseInt(formData.ageMax),
        isActivated: formData.isActivated,
        variants: formData.variants,
      };

      let saved;
      if (product) {
        saved = await updateProduct(product.id, payload);
      } else {
        saved = await createProduct(payload);
      }

      setSavedProduct(saved.data);
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form-modal">
        <div className="product-form-header">
          <h2>{product ? "Modifier le produit" : "Ajouter un produit"}</h2>
          <button className="product-form-close" onClick={onClose}>✕</button>
        </div>

        {error && <p className="product-form-error">{error}</p>}

        <div className="product-form-body">
          {/* Infos générales */}
          <form onSubmit={handleSubmit}>
            <div className="product-form-section">
              <h3>Informations générales</h3>

              <div className="product-form-row">
                <div className="product-form-field">
                  <label>Nom du produit</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="product-form-field">
                  <label>Type</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                  >
                    <option value="BOARD">Planche</option>
                    <option value="MODULE">Module</option>
                    <option value="SET_PREDEFINED">Pack prédéfini</option>
                  </select>
                </div>
              </div>

              <div className="product-form-field">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div className="product-form-row">
                <div className="product-form-field">
                  <label>Age minimum</label>
                  <input
                    type="number"
                    name="ageMin"
                    value={formData.ageMin}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="product-form-field">
                  <label>Age maximum</label>
                  <input
                    type="number"
                    name="ageMax"
                    value={formData.ageMax}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
                <div className="product-form-field product-form-field--checkbox">
                  <label>
                    <input
                      type="checkbox"
                      name="isActivated"
                      checked={formData.isActivated}
                      onChange={handleChange}
                    />
                    Produit actif
                  </label>
                </div>
              </div>
            </div>

            {/* Variantes (uniquement si nouveau produit) */}
            {!product && (
              <div className="product-form-section">
                <div className="product-form-section-header">
                  <h3>Variantes</h3>
                  <button
                    type="button"
                    className="btn-add-variant"
                    onClick={handleAddVariant}
                  >
                    + Ajouter une variante
                  </button>
                </div>

                {formData.variants.map((variant, index) => (
                  <div key={index} className="variant-row">
                    <div className="product-form-field">
                      <label>Taille</label>
                      <select
                        value={variant.size}
                        onChange={(e) => handleVariantChange(index, "size", e.target.value)}
                      >
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                      </select>
                    </div>
                    <div className="product-form-field">
                      <label>Prix (€)</label>
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div className="product-form-field">
                      <label>Stock</label>
                      <input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                        min="0"
                        required
                      />
                    </div>
                    {formData.productType === "BOARD" && (
                      <div className="product-form-field">
                        <label>Nb trous</label>
                        <input
                          type="number"
                          value={variant.holesCount}
                          onChange={(e) => handleVariantChange(index, "holesCount", e.target.value)}
                          min="0"
                        />
                      </div>
                    )}
                    {formData.productType === "MODULE" && (
                      <div className="product-form-field">
                        <label>Trous requis</label>
                        <input
                          type="number"
                          value={variant.holesRequired}
                          onChange={(e) => handleVariantChange(index, "holesRequired", e.target.value)}
                          min="0"
                        />
                      </div>
                    )}
                    <button
                      type="button"
                      className="btn-remove-variant"
                      onClick={() => handleRemoveVariant(index)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="product-form-submit" disabled={loading}>
              {loading ? "Sauvegarde..." : product ? "Modifier" : "Créer le produit"}
            </button>
          </form>

          {/* Sections disponibles après création */}
          {savedProduct && (
            <>
              <ProductVariants product={savedProduct} />
              <ProductImages product={savedProduct} />
              {savedProduct.productType === "SET_PREDEFINED" && (
                <ProductSetItems product={savedProduct} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductForm;