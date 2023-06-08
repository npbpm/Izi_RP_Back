const mongoose = require("mongoose");

// l'information a stocker dans la BDD est encore à définir, ce premier model est pour tester pendant la phase de dev.

const structureSchema = {
  name: {
    type: String,
  },
  clientId: {
    type: String,
  },
};

const Structure = mongoose.model("Structure", structureSchema);

module.exports = Structure;
