const mongoose = require("mongoose");

// l'information a stocker dans la BDD est encore à définir, ce premier model est pour tester pendant la phase de dev.

const siteSchema = {
  name: {
    type: String,
    required: true,
  },
  structureId: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  }
};

const Site = mongoose.model("Site", siteSchema);

module.exports = Site;
