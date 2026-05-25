import { useRef, useState } from "react";
import { addImages, deleteImage } from "../../../services/product.service";
import "./ProductImages.css";

const MAX_FILES_PER_SELECTION = 5;
const TARGET_UPLOAD_SIZE_BYTES = 900 * 1024;
const MAX_IMAGE_DIMENSION = 1800;
const COMPRESSION_QUALITY_STEPS = [0.82, 0.72, 0.62, 0.52];
const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const formatFileSize = (sizeInBytes) => {
  if (sizeInBytes < 1024) {
    return `${sizeInBytes} o`;
  }

  if (sizeInBytes < 1024 * 1024) {
    return `${Math.round(sizeInBytes / 1024)} Ko`;
  }

  return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} Mo`;
};

const buildCompressedFileName = (fileName) => {
  return `${fileName.replace(/\.[^/.]+$/, "") || "image"}.webp`;
};

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Impossible de lire l'image "${file.name}".`));
    };

    image.src = objectUrl;
  });

const canvasToBlob = (canvas, quality) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Impossible de compresser cette image."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      quality
    );
  });

const createResizedCanvas = (image, scale = 1) => {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const longestEdge = Math.max(sourceWidth, sourceHeight);
  const resizeRatio = Math.min(1, MAX_IMAGE_DIMENSION / longestEdge) * scale;
  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(sourceWidth * resizeRatio));
  canvas.height = Math.max(1, Math.round(sourceHeight * resizeRatio));

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Impossible de préparer l'image pour l'upload.");
  }

  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  return canvas;
};

const optimizeImageForUpload = async (file) => {
  if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      `Le fichier "${file.name}" doit être au format JPG, PNG ou WEBP.`
    );
  }

  if (file.size <= TARGET_UPLOAD_SIZE_BYTES) {
    return file;
  }

  const image = await loadImage(file);
  const scaleSteps = [1, 0.9, 0.8, 0.7, 0.6];

  for (const scale of scaleSteps) {
    const canvas = createResizedCanvas(image, scale);

    for (const quality of COMPRESSION_QUALITY_STEPS) {
      const blob = await canvasToBlob(canvas, quality);

      if (blob.size <= TARGET_UPLOAD_SIZE_BYTES) {
        return new File([blob], buildCompressedFileName(file.name), {
          type: "image/webp",
          lastModified: Date.now(),
        });
      }
    }
  }

  throw new Error(
    `Le fichier "${file.name}" reste trop volumineux après optimisation. Essayez une image plus légère.`
  );
};

const getUploadErrorMessage = (error) => {
  if (error?.response?.status === 413) {
    return "Le serveur refuse un fichier trop volumineux. Réduisez l'image ou augmentez la limite d'upload côté serveur.";
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Erreur lors de l'envoi des images."
  );
};

function ProductImages({ product }) {
  const [images, setImages] = useState(product.images || []);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const nextFiles = Array.from(event.target.files || []);

    if (nextFiles.length > MAX_FILES_PER_SELECTION) {
      setError(
        `Vous pouvez sélectionner jusqu'à ${MAX_FILES_PER_SELECTION} images à la fois.`
      );
      setFiles([]);
      event.target.value = "";
      return;
    }

    setFiles(nextFiles);
    setError("");
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (files.length === 0) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      for (const file of files) {
        const optimizedFile = await optimizeImageForUpload(file);
        const formData = new FormData();

        formData.append("images", optimizedFile, optimizedFile.name);
        await addImages(product.id, formData);
      }

      window.location.reload();
    } catch (error) {
      console.error(error);
      setError(getUploadErrorMessage(error));
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
      <p className="product-images__hint">
        Formats acceptés : JPG, PNG, WEBP. Les images sont optimisées avant
        envoi pour limiter les erreurs d'upload.
      </p>

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

      {error ? <p className="product-images__error">{error}</p> : null}

      <form className="product-images__upload" onSubmit={handleUpload}>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        {files.length > 0 ? (
          <p className="product-images__selection">
            {files.length} image(s) sélectionnée(s), jusqu&apos;à{" "}
            {formatFileSize(TARGET_UPLOAD_SIZE_BYTES)} par envoi optimisé.
          </p>
        ) : null}
        <button type="submit" className="btn-save" disabled={loading || files.length === 0}>
          {loading ? "Upload..." : "Ajouter les images"}
        </button>
      </form>
    </div>
  );
}

export default ProductImages;

