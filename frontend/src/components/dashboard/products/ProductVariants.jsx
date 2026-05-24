import { useState } from "react";
import {
  addVariant,
  updateVariant,
  deleteVariant,
} from "../../../services/product.service";
import "./ProductVariants.css";

function ProductVariants({ product }) {
  const [variants, setVariants] = useState(product.variants || []);
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [formData, setFormData] = useState({
    size: "S",
    price: "",
    stock: "",
    holesCount: "",
    holesRequired: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (variant) => {
    setEditingVariant(variant);
    setFormData({
      size: variant.size,
      price: variant.price,
      stock: variant.stock,
      holesCount: variant.holesCount || "",
      holesRequired: variant.holesRequired || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingVariant) {
        const updated = await updateVariant(editingVariant.id, formData);
        setVariants((prev) =>
          prev.map((v) => (v.id === editingVariant.id ? updated.data : v))
        );
      } else {
        const added = await addVariant(product.id, formData);
        setVariants((prev) => [...prev, added.data]);
      }
      setShowForm(false);
      setEditingVariant(null);
      setFormData({ size: "S", price: "", stock: "", holesCount: "", holesRequired: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (variantId) => {
    if (!window.confirm("Supprimer cette variante ?")) return;
    try {
      await deleteVariant(variantId);
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="product-variants">
      <div className="product-variants__header">
        <h3>Variantes</h3>
        <button
          className="btn-add-variant"
          onClick={() => {
            setEditingVariant(null);
            setFormData({ size: "S", price: "", stock: "", holesCount: "", holesRequired: "" });
            setShowForm(true);
          }}
        >
          + Ajouter
        </button>
      </div>

      <table className="variants-table">
        <thead>
          <tr>
            <th>Taille</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Trous</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.id}>
              <td>{variant.size}</td>
              <td>{variant.price}€</td>
              <td>{variant.stock}</td>
              <td>
                {variant.holesCount
                  ? `${variant.holesCount} trous`
                  : variant.holesRequired
                  ? `${variant.holesRequired} requis`
                  : "-"}
              </td>
              <td className="variants-table__actions">
                <button className="btn-edit" onClick={() => handleEdit(variant)}>
                  Modifier
                </button>
                <button className="btn-delete" onClick={() => handleDelete(variant.id)}>
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <form className="variant-form" onSubmit={handleSubmit}>
          <h4>{editingVariant ? "Modifier la variante" : "Nouvelle variante"}</h4>
          <div className="variant-form__row">
            <div className="variant-form__field">
              <label>Taille</label>
              <select name="size" value={formData.size} onChange={handleChange}>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
              </select>
            </div>
            <div className="variant-form__field">
              <label>Prix (€)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
              />
            </div>
            <div className="variant-form__field">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            {product.productType === "BOARD" && (
              <div className="variant-form__field">
                <label>Nb trous</label>
                <input
                  type="number"
                  name="holesCount"
                  value={formData.holesCount}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}
            {product.productType === "MODULE" && (
              <div className="variant-form__field">
                <label>Trous requis</label>
                <input
                  type="number"
                  name="holesRequired"
                  value={formData.holesRequired}
                  onChange={handleChange}
                  min="0"
                />
              </div>
            )}
          </div>
          <div className="variant-form__actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProductVariants;