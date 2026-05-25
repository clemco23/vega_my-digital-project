const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const ALLOWED_MIME_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};
const MAX_UPLOAD_FILE_SIZE_MB = Number(
  process.env.UPLOAD_MAX_FILE_SIZE_MB || 10
);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const resolveUploadFolder = (req) => {
  return req.baseUrl.includes("/products") ? "products" : "blogs";
};

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: resolveUploadFolder(req),
      allowed_formats: Object.values(ALLOWED_MIME_TYPES),
      resource_type: "image",
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_UPLOAD_FILE_SIZE_MB * 1024 * 1024,
    files: 5,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      const error = new Error(
        "Seuls les fichiers JPG, PNG et WEBP sont autorises."
      );
      error.statusCode = 400;
      cb(error);
      return;
    }

    cb(null, true);
  },
});

module.exports = upload;
