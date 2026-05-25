import { useEffect, useState } from "react";
import {
  getProductsAdmin,
  deleteProduct,
  updateProduct,
} from "../../../services/product.service";
import "./ProductsList.css";

function ProductsList({ onEdit, onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProductsAdmin();
      setProducts(data.data);
      setFeedback({ type: "", message: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    try {
      setFeedback({ type: "", message: "" });
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setFeedback({
        type: "success",
        message: "Produit supprimé.",
      });
    } catch (error) {
      console.error(error);

      const backendMessage =
        error.response?.data?.message ||
        "Impossible de supprimer ce produit.";

      if (error.response?.status === 409) {
        const shouldDeactivate = window.confirm(
          `${backendMessage}\n\nVoulez-vous le désactiver à la place ?`
        );

        if (!shouldDeactivate) {
          setFeedback({
            type: "error",
            message: backendMessage,
          });
          return;
        }

        try {
          const updated = await updateProduct(id, { isActivated: false });

          setProducts((previousProducts) =>
            previousProducts.map((product) =>
              product.id === id
                ? {
                    ...product,
                    ...updated.data,
                  }
                : product
            )
          );
          setFeedback({
            type: "success",
            message: "Produit désactivé car il est déjà lié à une commande.",
          });
          return;
        } catch (deactivationError) {
          console.error(deactivationError);
          setFeedback({
            type: "error",
            message:
              deactivationError.response?.data?.message ||
              "Suppression impossible, et la désactivation a aussi échoué.",
          });
          return;
        }
      }

      setFeedback({
        type: "error",
        message: backendMessage,
      });
    }
  };

  if (loading) return <p className="products-loading">Chargement...</p>;

  return (
    <div className="products-list">
      <div className="products-list__header">
        <h2>Produits</h2>
        <button className="btn-add" onClick={onAdd}>
          + Ajouter un produit
        </button>
      </div>

      {feedback.message ? (
        <p
          className={`products-feedback ${feedback.type === "error" ? "products-feedback--error" : "products-feedback--success"}`}
        >
          {feedback.message}
        </p>
      ) : null}

      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Âge</th>
            <th>Variantes</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <span className={`badge badge--${product.productType.toLowerCase()}`}>
                  {product.productType}
                </span>
              </td>
              <td>{product.ageMin} - {product.ageMax} ans</td>
              <td>{product.variants.length} variante(s)</td>
              <td>
                <span className={`badge ${product.isActivated ? "badge--active" : "badge--inactive"}`}>
                  {product.isActivated ? "Actif" : "Inactif"}
                </span>
              </td>
              <td className="products-table__actions">
                <button
                  className="btn-edit"
                  onClick={() => onEdit(product)}
                >
                  Modifier
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(product.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p className="products-empty">Aucun produit pour l'instant.</p>
      )}
    </div>
  );
}

export default ProductsList;

