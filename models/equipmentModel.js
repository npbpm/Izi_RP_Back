const mongoose = require("mongoose");

const equipmentSchema = {
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  modelType: String,
  year: Number,
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
};

const Equipment = mongoose.model("Equipment", equipmentSchema);

module.exports = Equipment;
