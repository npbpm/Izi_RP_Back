const mongoose = require("mongoose");
const config = require("config");

//We will need to whitelist the ip's that are going to connect to the databse, for now only my personal IP (Nicolás) is whitelisted

const connectDB = async () => {
  let db;

  if (process.env.NODE_ENV !== "production") {
    db = config.get("mongoURI");
  } else {
    db = process.env.mongoURI;
  }
  try {
    await mongoose.connect(db);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Couldn't connect to MongoDB");
    process.exit(1);
  }
};

module.exports = connectDB;
