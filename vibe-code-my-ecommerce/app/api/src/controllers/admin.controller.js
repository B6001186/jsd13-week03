const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const Payment = require("../models/Payment");

exports.getDashboard = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: "customer" });
    const totalProducts = await Product.countDocuments();

    const pendingPayments = await Order.countDocuments({
      status_id: await getStatusId("pending_payment"),
    });

    const totalRevenue = await Payment.aggregate([
      { $match: { verified: true } },
      { $group: { _id: null, total: { $sum: "$amount_paid" } } },
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      pendingPayments,
      totalRevenue: totalRevenue[0]?.total || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) {
      filter.status_id = await getStatusId(status);
    }

    const orders = await Order.find(filter)
      .populate("user_id", "name email")
      .populate("status_id", "status_name description")
      .populate("items.product_id", "product_name")
      .sort({ created_at: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status_id, status_name, tracking_number } = req.body;
    const update = {};
    if (status_name) {
      const status = await require("../models/Status").findOne({ status_name });
      if (status) update.status_id = status._id;
    } else if (status_id) {
      update.status_id = status_id;
    }
    if (tracking_number) update.tracking_number = tracking_number;

    const order = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
    })
      .populate("user_id", "name email")
      .populate("status_id", "status_name description");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

async function getStatusId(statusName) {
  const Status = require("../models/Status");
  const status = await Status.findOne({ status_name: statusName });
  return status?._id;
}

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "customer" })
      .select("-password")
      .sort({ created_at: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "order_id",
        populate: [
          { path: "user_id", select: "name email" },
          { path: "status_id", select: "status_name description" },
        ],
      })
      .sort({ created_at: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ created_at: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
