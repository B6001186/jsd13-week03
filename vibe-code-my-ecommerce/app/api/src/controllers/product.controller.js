const Product = require("../models/Product");
const { uploadProduct } = require("../config/cloudinary");

exports.uploadImage = [
  uploadProduct.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }
      res.json({ url: req.file.path });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

exports.getAll = async (req, res) => {
  try {
    const products = await Product.find({ is_active: true }).sort({
      created_at: -1,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { product_name, caption, pics_urls, price, inventory } = req.body;

    if (!product_name || price == null) {
      return res
        .status(400)
        .json({ message: "product_name and price are required" });
    }

    const product = await Product.create({
      product_name,
      caption: caption || "",
      pics_urls: pics_urls || [],
      price,
      inventory: inventory || 0,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
