const express = require("express");
const router = express.Router();
const {
  getDashboard,
  getAllOrders,
  updateOrder,
  getAllUsers,
  getAllPayments,
  getAllProducts,
} = require("../controllers/admin.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.get("/dashboard", auth, adminOnly, getDashboard);
router.get("/orders", auth, adminOnly, getAllOrders);
router.put("/orders/:id", auth, adminOnly, updateOrder);
router.get("/users", auth, adminOnly, getAllUsers);
router.get("/payments", auth, adminOnly, getAllPayments);
router.get("/products", auth, adminOnly, getAllProducts);

module.exports = router;
