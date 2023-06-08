const mongoose = require("mongoose");

const workerSchema = {
  clientId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    required: true,
  },
  numSocialSecurity: {
    type: String,
  },
  charge: {
    type: String,
    default: "Null",
  },
  contract: {
    type: String,
    default: "Null",
  },
  hiringDate: {
    type: Date,
    default: Date.now,
  },
  fullSuivDossim: {
    type: Array,
    default: [],
  },
  complSuivDossim: {
    type: Array,
    default: [],
  },
};

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;
