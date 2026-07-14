const express = require("express");
const router = express.Router();
const {
  getUserOrders,
  getOrderById,
  createOrder,
  updateTracking,
  updateStatus,
} = require("../controllers/order.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/", auth, getUserOrders);
router.get("/:id", auth, getOrderById);
router.post("/", auth, createOrder);
router.put("/:id/tracking", auth, adminOnly, updateTracking);
router.put("/:id/status", auth, adminOnly, updateStatus);

module.exports = router;
