const mongoose = require("mongoose");
const config = require("config");

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
