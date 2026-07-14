const express = require("express");
const router = express.Router();
const {
  uploadSlip,
  getPaymentByOrder,
  verifyPayment,
} = require("../controllers/payment.controller");
const { auth, adminOnly } = require("../middleware/auth");

router.post("/upload", auth, uploadSlip);
router.get("/:orderId", auth, getPaymentByOrder);
router.put("/:id/verify", auth, adminOnly, verifyPayment);

module.exports = router;
