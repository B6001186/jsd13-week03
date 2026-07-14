const Order = require("../models/Order");
const Product = require("../models/Product");
const Status = require("../models/Status");

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user.id })
      .populate("status_id", "status_name description")
      .populate("items.product_id", "product_name pics_urls")
      .sort({ created_at: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("status_id", "status_name description")
      .populate("items.product_id", "product_name pics_urls price");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (
      order.user_id.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, shipping_address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order must have items" });
    }

    if (!shipping_address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    let total_amount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product ${item.product_id} not found` });
      }
      if (product.inventory < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.product_name}`,
        });
      }

      total_amount += product.price * item.quantity;
      orderItems.push({
        product_id: product._id,
        quantity: item.quantity,
        price_at_purchase: product.price,
      });

      product.inventory -= item.quantity;
      await product.save();
    }

    const pendingStatus = await Status.findOne({
      status_name: "pending_payment",
    });

    const order = await Order.create({
      user_id: req.user.id,
      items: orderItems,
      total_amount,
      shipping_address,
      status_id: pendingStatus._id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTracking = async (req, res) => {
  try {
    const { tracking_number } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { tracking_number },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status_id } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status_id },
      { new: true }
    ).populate("status_id", "status_name description");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
