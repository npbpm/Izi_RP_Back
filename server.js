const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("./config/db");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const path = require("path");

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(methodOverride("_method"));
app.use(express.json());

//After 5 seconds, the request will return a timeout
app.use(function (req, res, next) {
  res.setTimeout(5000, function () {
    console.log("Request has timed out.");
    res.status(408).send("Request has timed out.");
  });
  next();
});

connectDB();

//Routes
app.use("/api/connexion", require("./routes/loginRoute"));
app.use("/api/user", require("./routes/clientsRoute"));
app.use("/api/uploads", require("./routes/uploadsRoute"));
app.use("/api/verifications/uploads", require("./routes/verifUploadsRoute"));
app.use("/api/verifications", require("./routes/verificationsRoute"));
app.use("/api/workers/uploads", require("./routes/workerUploadsRoute"));
app.use("/api/workers", require("./routes/workersRoute"));
app.use("/api/equipments", require("./routes/equipmentsRoute"));
app.use("/api/structure", require("./routes/structureRoute"));
app.use("/api/site", require("./routes/siteRoute"));
app.use("/api/email", require("./routes/emailRoute"));

if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("izi-rp/dist"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "izi-rp", "dist", "index.html"));
  });
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log("Express server running on port " + PORT);
});
