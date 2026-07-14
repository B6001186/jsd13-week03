const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const slipStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "d2c-bookstore/slips",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 800, height: 800, crop: "limit" }],
  },
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "d2c-bookstore/products",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1200, height: 1200, crop: "limit" }],
  },
});

const uploadSlip = multer({
  storage: slipStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadProduct = multer({
  storage: productStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = { cloudinary, uploadSlip, uploadProduct };
