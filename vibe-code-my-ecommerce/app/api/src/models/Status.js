const mongoose = require("mongoose");

const statusSchema = new mongoose.Schema({
  status_name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Status", statusSchema);
