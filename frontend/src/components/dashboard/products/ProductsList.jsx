import { useEffect, useState } from "react";
import { getProductsAdmin, deleteProduct } from "../../../services/product.service";
import "./ProductsList.css";

function ProductsList({ onEdit, onAdd }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProductsAdmin();
      setProducts(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
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

      <table className="products-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Age</th>
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