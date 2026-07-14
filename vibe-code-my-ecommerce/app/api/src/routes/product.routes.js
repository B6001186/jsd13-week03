const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  create,
  update,
  remove,
  uploadImage,
} = require("../controllers/product.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", auth, adminOnly, create);
router.post("/upload", auth, adminOnly, uploadImage);
router.put("/:id", auth, adminOnly, update);
router.delete("/:id", auth, adminOnly, remove);

module.exports = router;
