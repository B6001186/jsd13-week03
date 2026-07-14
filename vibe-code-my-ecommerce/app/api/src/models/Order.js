const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price_at_purchase: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },
    shipping_address: {
      details: String,
      subdistrict: String,
      district: String,
      province: String,
      zip_code: String,
    },
    tracking_number: {
      type: String,
      default: "",
    },
    status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Status",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Order", orderSchema);
