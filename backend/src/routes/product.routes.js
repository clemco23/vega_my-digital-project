const express = require("express");
const {
  getAll,
  getAllAdmin,
  getOne,
  getByType,
  getBySkill,
  create,
  update,
  updateVariantController,
  addVariantController,
  addImages,
  deleteImage,
  deleteVariantController,
  addSetItemController,
  deleteSetItemController,
  remove,
} = require("../controllers/product.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../config/cloudinary");

const router = express.Router();

// Routes publiques
router.get("/admin", authMiddleware, adminMiddleware, getAllAdmin);//
router.get("/type/:type", getByType);//
router.get("/skill/:skillId", getBySkill);//
router.get("/", getAll);//
router.get("/:id", getOne);//

// Routes admin - produits
router.post("/", authMiddleware, adminMiddleware, create);//
router.put("/:id", authMiddleware, adminMiddleware, update);//
router.delete("/:id", authMiddleware, adminMiddleware, remove);//

// Routes admin - variantes
router.post("/variants/:productId", authMiddleware, adminMiddleware, addVariantController);
router.put("/variants/:variantId", authMiddleware, adminMiddleware, updateVariantController);//
router.delete("/variants/:variantId", authMiddleware, adminMiddleware, deleteVariantController);//

// Routes admin - images
router.post("/:id/images", authMiddleware, adminMiddleware, upload.array("images", 5), addImages);//
router.delete("/images/:imageId", authMiddleware, adminMiddleware, deleteImage);//

// Routes admin - set items
router.post("/:id/set-items", authMiddleware, adminMiddleware, addSetItemController);//
router.delete("/set-items/:itemId", authMiddleware, adminMiddleware, deleteSetItemController);

module.exports = router;