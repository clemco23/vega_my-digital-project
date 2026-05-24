const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
  updateVariant,
  addProductImages,
  deleteProductImage,
  deleteVariant,
  getProductsByType,
  getProductsBySkill,
  addSetItem,
  deleteSetItem,
  addVariant,
} = require("../services/product.service");

const parsePositiveInt = (value) => {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : null;
};

const getAll = async (req, res) => {
  try {
    const products = await getAllProducts();

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const products = await getAllProductsAdmin();

    return res.status(200).json({
      data: products,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const getOne = async (req, res) => {
  try {
    const productId = parsePositiveInt(req.params.id);

    if (!productId) {
      return res.status(400).json({
        message: "ID invalide.",
      });
    }

    const product = await getProductById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const create = async (req, res) => {
  try {
    const {
      name,
      description,
      productType,
      ageMin,
      ageMax,
      variants,
      skillIds,
    } = req.body;

    if (
      !name ||
      !productType ||
      ageMin === undefined ||
      ageMax === undefined ||
      !Array.isArray(variants) ||
      variants.length === 0
    ) {
      return res.status(400).json({
        message: "Champs obligatoires manquants.",
      });
    }

    const parsedAgeMin = Number(ageMin);
    const parsedAgeMax = Number(ageMax);

    if (!Number.isInteger(parsedAgeMin) || !Number.isInteger(parsedAgeMax)) {
      return res.status(400).json({
        message: "Les âges doivent être des nombres entiers.",
      });
    }

    if (parsedAgeMin < 0 || parsedAgeMax < 0 || parsedAgeMin > parsedAgeMax) {
      return res.status(400).json({
        message: "Tranche d'âge invalide.",
      });
    }

    const product = await createProduct({
      name,
      description,
      productType,
      ageMin: parsedAgeMin,
      ageMax: parsedAgeMax,
      variants,
      skillIds,
    });

    return res.status(201).json({
      message: "Produit créé.",
      data: product,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const update = async (req, res) => {
  try {
    const productId = parsePositiveInt(req.params.id);

    if (!productId) {
      return res.status(400).json({
        message: "ID invalide.",
      });
    }

    const {
      name,
      description,
      productType,
      ageMin,
      ageMax,
      isActivated,
    } = req.body;

    const data = {};

    if (name !== undefined) {
      data.name = name;
    }

    if (description !== undefined) {
      data.description = description;
    }

    if (productType !== undefined) {
      data.productType = productType;
    }

    if (ageMin !== undefined) {
      const parsedAgeMin = Number(ageMin);

      if (!Number.isInteger(parsedAgeMin) || parsedAgeMin < 0) {
        return res.status(400).json({
          message: "ageMin invalide.",
        });
      }

      data.ageMin = parsedAgeMin;
    }

    if (ageMax !== undefined) {
      const parsedAgeMax = Number(ageMax);

      if (!Number.isInteger(parsedAgeMax) || parsedAgeMax < 0) {
        return res.status(400).json({
          message: "ageMax invalide.",
        });
      }

      data.ageMax = parsedAgeMax;
    }

    if (
      data.ageMin !== undefined &&
      data.ageMax !== undefined &&
      data.ageMin > data.ageMax
    ) {
      return res.status(400).json({
        message: "Tranche d'âge invalide.",
      });
    }

    if (isActivated !== undefined) {
      data.isActivated = isActivated === true || isActivated === "true";
    }

    const product = await updateProduct(productId, data);

    return res.status(200).json({
      message: "Produit mis à jour.",
      data: product,
    });
  } catch (error) {
    console.error(error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const remove = async (req, res) => {
  try {
    const productId = parsePositiveInt(req.params.id);

    if (!productId) {
      return res.status(400).json({
        message: "ID invalide.",
      });
    }

    await deleteProduct(productId);

    return res.status(200).json({
      message: "Produit supprimé.",
    });
  } catch (error) {
    console.error(error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    if (error.code === "P2025") {
      return res.status(404).json({
        message: "Produit introuvable.",
      });
    }

    return res.status(500).json({
      message: "Erreur serveur.",
    });
  }
};

const updateVariantController = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { price, stock, holesCount, holesRequired } = req.body;

    const variant = await updateVariant(variantId, { price, stock, holesCount, holesRequired });
    return res.status(200).json({ message: "Variante mise à jour.", data: variant });
  } catch (error) {
    console.error(error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const addImages = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Aucune image fournie." });
    }

    const imageUrls = req.files.map((file) => file.path);
    await addProductImages(id, imageUrls);

    return res.status(201).json({ message: "Images ajoutées." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    await deleteProductImage(imageId);
    return res.status(200).json({ message: "Image supprimée." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const deleteVariantController = async (req, res) => {
  try {
    const { variantId } = req.params;
    await deleteVariant(variantId);
    return res.status(200).json({ message: "Variante supprimée." });
  } catch (error) {
    console.error(error);

    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message,
      });
    }

    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getByType = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ["BOARD", "MODULE", "SET_PREDEFINED"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Type invalide." });
    }

    const products = await getProductsByType(type);
    return res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const getBySkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const products = await getProductsBySkill(skillId);
    return res.status(200).json({ data: products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const addSetItemController = async (req, res) => {
  try {
    const { id } = req.params;
    const { productVariantId, quantity } = req.body;

    if (!productVariantId || !quantity) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    const item = await addSetItem(id, productVariantId, quantity);
    return res.status(201).json({ message: "Produit ajouté au set.", data: item });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteSetItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    await deleteSetItem(itemId);
    return res.status(200).json({ message: "Produit retiré du set." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

const addVariantController = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, price, stock, holesCount, holesRequired } = req.body;

    if (!size || !price || !stock) {
      return res.status(400).json({ message: "Champs obligatoires manquants." });
    }

    const variant = await addVariant(productId, { size, price, stock, holesCount, holesRequired });
    return res.status(201).json({ message: "Variante ajoutée.", data: variant });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};


module.exports = {
  getAll,
  getOne,
  getAllAdmin,
  create,
  update,
  remove,
  updateVariantController,
  deleteVariantController,
  addImages,
  deleteImage,
  getByType,
  getBySkill,
  addSetItemController,
  deleteSetItemController,
  addVariantController,
};
