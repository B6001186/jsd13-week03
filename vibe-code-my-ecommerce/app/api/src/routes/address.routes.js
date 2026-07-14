const express = require("express");
const router = express.Router();
const {
  getUserAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");
const { auth } = require("../middleware/auth");

router.get("/", auth, getUserAddresses);
router.post("/", auth, createAddress);
router.put("/:id", auth, updateAddress);
router.delete("/:id", auth, deleteAddress);

module.exports = router;
