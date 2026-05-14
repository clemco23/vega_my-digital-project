const express = require("express");
const { getAll, getOne, create, update, remove, getAllAdmin, updateVariantController, deleteVariantController,
  addImages,
  deleteImage, } = require("../controllers/product.controller");
const { authMiddleware, adminMiddleware } = require("../middlewares/auth.middleware");
const upload = require("../config/cloudinary");

const router = express.Router();


router.get("/admin", authMiddleware, adminMiddleware, getAllAdmin);
router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", authMiddleware, adminMiddleware, create);
router.put("/:id", authMiddleware, adminMiddleware, update);
router.put("/variants/:variantId", authMiddleware, adminMiddleware, updateVariantController);
router.post("/:id/images", authMiddleware, adminMiddleware, upload.array("images", 5), addImages);
router.delete("/images/:imageId", authMiddleware, adminMiddleware, deleteImage);
router.delete("/variants/:variantId", authMiddleware, adminMiddleware, deleteVariantController);
router.delete("/:id", authMiddleware, adminMiddleware, remove);
// router.get("/", getAll);
// router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), create);
// router.patch("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), update);
// router.delete("/:id", authMiddleware, adminMiddleware, remove);
// router.get("/admin", authMiddleware, adminMiddleware, getAllAdmin);
// router.get("/:id", getOne);

module.exports = router;