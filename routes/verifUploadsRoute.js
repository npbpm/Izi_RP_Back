const express = require("express");
const router = express.Router();
const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const config = require("config");
const auth = require("../middleware/auth");

let mongoURI;

if (process.env.NODE_ENV !== "production") {
  mongoURI = config.get("mongoURI");
} else {
  mongoURI = process.env.mongoURI;
}

const conn = mongoose.connection;

//Init GridFS
let gfs;

conn.once("open", () => {
  // Init Stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("verificationUploads");
});

// Create Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "verificationUploads",
        };
        resolve(fileInfo);
      });
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("The file is not a PDF"));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // 10 MB
  },
  fileFilter: fileFilter,
});

// @route   POST /api/verifications/uploads
// @desc    Upload file to the DB
// @acces   Private
router.post("/", auth, upload.single("file"), (req, res) => {
  const verifId = req.body.verifIndex;

  //Associates the clientId to every single file uploaded
  gfs.files.update(
    { filename: `${req.file.filename}` },
    { $set: { clientId: req.client.id, verifId } }
  );

  res.json(req.file);
});

// @route   GET /api/verifications/uploads/files
// @desc    Get all verification files from the DB (Dev)
// @acces   Private
router.get("/files", auth, async (req, res) => {
  let arrayFiles = [];
  const cursor = gfs.files.find();
  for await (const file of cursor) {
    arrayFiles.push(file);
  }
  res.json(arrayFiles);
});

// @route   GET /api/verifications/uploads/files/:id
// @desc    Get all files from the DB corresponding to the clientID
// @acces   Private
router.get("/files/:clientId", auth, async (req, res) => {
  let arrayFiles = [];
  const cursor = gfs.files.find({ clientId: req.params.clientId });
  for await (const file of cursor) {
    arrayFiles.push(file);
  }
  res.json(arrayFiles);
});

// @route   GET /api/verifications/uploads/files/download/:filename
// @desc    Download File by Filename
// @acces   Public
router.get("/files/download/:filename", async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    const readstream = gfs.createReadStream(file.filename);
    res.set("Content-Type", file.contentType);
    res.set(
      "Content-Disposition",
      'attachment; filename="' + file.filename + '"'
    );
    readstream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/verifications/uploads/files/:id
// @desc    Delete File by File index
// @acces   Private
router.delete("/files/:verifId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({ verifId: req.params.verifId });
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    await gfs.db.collection("verificationUploads.chunks").deleteMany({
      files_id: mongoose.Types.ObjectId(file._id),
    });

    await gfs.files.deleteOne({
      verifId: file.verifId,
    });

    res.json({ msg: "File Deleted" });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

module.exports = router;
