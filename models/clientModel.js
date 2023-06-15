const mongoose = require("mongoose");

// l'information a stocker dans la BDD est encore à définir, ce premier model est pour tester pendant la phase de dev.

const clientSchema = {
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  firstConn: {
    type: Boolean,
    required: true,
    default: true,
  },
  firstName: {type: String,},
  lastName: {type: String,},
  structure: {type: String},
  structureId: {type: String},
  site: {type: String}
};

const Client = mongoose.model("Client", clientSchema);

module.exports = Client;
