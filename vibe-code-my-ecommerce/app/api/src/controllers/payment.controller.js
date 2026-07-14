const { uploadSlip } = require("../config/cloudinary");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Status = require("../models/Status");

exports.uploadSlip = [
  uploadSlip.single("slip"),
  async (req, res) => {
    try {
      const { order_id, method, amount_paid } = req.body;

      if (!order_id || !method || !amount_paid) {
        return res
          .status(400)
          .json({ message: "order_id, method, and amount_paid required" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Slip image is required" });
      }

      const order = await Order.findById(order_id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.user_id.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      const payment = await Payment.create({
        order_id,
        method,
        amount_paid: Number(amount_paid),
        slip_url: req.file.path,
      });

      const paidStatus = await Status.findOne({ status_name: "paid" });
      await Order.findByIdAndUpdate(order_id, { status_id: paidStatus._id });

      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({
      order_id: req.params.orderId,
    }).populate("order_id", "total_amount");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { verified: true },
      { new: true }
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment verified", payment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
