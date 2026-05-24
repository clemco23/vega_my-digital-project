import { useState } from "react";
import { addImages, deleteImage } from "../../../services/product.service";
import "./ProductImages.css";

function ProductImages({ product }) {
  const [images, setImages] = useState(product.images || []);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);
      await addImages(product.id, formData);
      // Recharger les images
      window.location.reload();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (!window.confirm("Supprimer cette image ?")) return;
    try {
      await deleteImage(imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="product-images">
      <h3>Images</h3>

      <div className="product-images__grid">
        {images.map((image) => (
          <div key={image.id} className="product-images__item">
            <img src={image.url} alt={`Image ${image.position}`} />
            <button
              className="product-images__delete"
              onClick={() => handleDelete(image.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <form className="product-images__upload" onSubmit={handleUpload}>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files))}
        />
        <button type="submit" className="btn-save" disabled={loading || files.length === 0}>
          {loading ? "Upload..." : "Ajouter les images"}
        </button>
      </form>
    </div>
  );
}

export default ProductImages;