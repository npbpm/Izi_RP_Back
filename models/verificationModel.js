const mongoose = require("mongoose");

const verificationSchema = {
  type: {
    type: Boolean,
    default: false,
  },
  year: Number,
  name: String,
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  conformity: {
    type: Boolean,
    default: false,
  },
  equipments: String,
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  siteId:{
    type:String,
    required:false
  },
  materials: Array,
};

const Verification = mongoose.model("Verification", verificationSchema);

module.exports = Verification;
