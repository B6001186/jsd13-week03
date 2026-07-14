const Address = require("../models/Address");

exports.getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user_id: req.user.id }).sort({
      is_default: -1,
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { details, subdistrict, district, province, zip_code, is_default } =
      req.body;

    if (!details || !subdistrict || !district || !province || !zip_code) {
      return res.status(400).json({ message: "All address fields required" });
    }

    if (is_default) {
      await Address.updateMany(
        { user_id: req.user.id },
        { is_default: false }
      );
    }

    const address = await Address.create({
      user_id: req.user.id,
      details,
      subdistrict,
      district,
      province,
      zip_code,
      is_default: is_default || false,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (address.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (req.body.is_default) {
      await Address.updateMany(
        { user_id: req.user.id },
        { is_default: false }
      );
    }

    const updated = await Address.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    if (address.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Address.findByIdAndDelete(req.params.id);
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
