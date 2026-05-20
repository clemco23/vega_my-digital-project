import { useState, useEffect } from "react";
import { addSetItem, deleteSetItem, getProductsAdmin } from "../../../services/product.service";
import "./ProductSetItems.css";

function ProductSetItems({ product }) {
  const [setItems, setSetItems] = useState([]);
  const [variants, setVariants] = useState([]);
  const [formData, setFormData] = useState({
    setVariantId: "",
    productVariantId: "",
    quantity: 1,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVariants();
    // Récupérer les set items depuis le produit
    if (product.variants) {
      const items = product.variants.flatMap((v) => v.setVariantItems || []);
      setSetItems(items);
    }
  }, [product]);

  const fetchVariants = async () => {
    try {
      const data = await getProductsAdmin();
      const allVariants = data.data.flatMap((p) =>
        p.variants.map((v) => ({
          ...v,
          productName: p.name,
          productType: p.productType,
        }))
      );
      setVariants(allVariants.filter((v) => v.productType !== "SET_PREDEFINED"));
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const added = await addSetItem(formData.setVariantId, {
        productVariantId: formData.productVariantId,
        quantity: formData.quantity,
      });
      setSetItems((prev) => [...prev, added.data]);
      setFormData({ setVariantId: "", productVariantId: "", quantity: 1 });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Retirer ce produit du pack ?")) return;
    try {
      await deleteSetItem(itemId);
      setSetItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="product-set-items">
      <h3>Contenu du pack</h3>

      <table className="set-items-table">
        <thead>
          <tr>
            <th>Variante du pack</th>
            <th>Produit inclus</th>
            <th>Quantité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {setItems.map((item) => (
            <tr key={item.id}>
              <td>Variante #{item.setVariantId}</td>
              <td>Variante #{item.productVariantId}</td>
              <td>{item.quantity}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(item.id)}
                >
                  Retirer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className="set-items-form" onSubmit={handleSubmit}>
        <h4>Ajouter un produit au pack</h4>
        <div className="set-items-form__row">
          <div className="set-items-form__field">
            <label>Variante du pack</label>
            <select
              value={formData.setVariantId}
              onChange={(e) => setFormData((prev) => ({ ...prev, setVariantId: e.target.value }))}
              required
            >
              <option value="">Choisir...</option>
              {product.variants?.map((v) => (
                <option key={v.id} value={v.id}>
                  {product.name} - {v.size} ({v.price}€)
                </option>
              ))}
            </select>
          </div>
          <div className="set-items-form__field">
            <label>Produit à inclure</label>
            <select
              value={formData.productVariantId}
              onChange={(e) => setFormData((prev) => ({ ...prev, productVariantId: e.target.value }))}
              required
            >
              <option value="">Choisir...</option>
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.productName} - {v.size} ({v.price}€)
                </option>
              ))}
            </select>
          </div>
          <div className="set-items-form__field">
            <label>Quantité</label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData((prev) => ({ ...prev, quantity: e.target.value }))}
              min="1"
              required
            />
          </div>
        </div>
        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? "Ajout..." : "Ajouter au pack"}
        </button>
      </form>
    </div>
  );
}

export default ProductSetItems;