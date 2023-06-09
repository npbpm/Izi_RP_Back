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
  gfs.collection("uploads");
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
          bucketName: "uploads"
          
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

// @route   POST /api/uploads
// @desc    Upload file to the DB
// @acces   Private
router.post("/", auth, upload.single("file"), (req, res) => {
  // console.log(req.body.missions_id);

  //Associates the clientId to every single file uploaded
  //It also gives every single file its own missionId, so we can load them in the right order in the front side
  gfs.files.update(
    { filename: `${req.file.filename}` },
    { $set: { clientId: req.client.id ,siteId:req.body.sites_id} },
    console.log("file succesfully uploaded",req.body.sites_id)
  );

  if (req.body.missions_id) {
    gfs.files.update(
      { filename: `${req.file.filename}` },
      { $set: { missionId: req.body.missions_id } }
    );
  }

  res.json({ file: req.file });
});

// @route   GET /api/uploads/files
// @desc    Get all files from the DB
// @acces   Private
router.get("/files", auth, async (req, res) => {
  let arrayFiles = [];
  const cursor = gfs.files.find();
  for await (const file of cursor) {
    arrayFiles.push(file);
    console.log("found files")
  }
  res.json(arrayFiles);
});

// @route   GET /api/uploads/files/:id
// @desc    Get all files from the DB corresponding to the clientID
// @acces   Private
router.get("/files/:clientId", auth, async (req, res) => {
  let arrayFiles = [];
  const cursor = gfs.files.find({ clientId: req.params.clientId });
  console.log("heh ",req.params)
  for await (const file of cursor) {
    arrayFiles.push(file);
  }
  res.json(arrayFiles);
});

// @route GET /api/uploads/files/:siteId
// @desc Get all files from DB corresponding to the SiteId
// @acces 
router.get("/files/:siteId", auth, async (req, res) => {
  let arrayFiles = [];
const cursor = gfs.files.find({ siteId: req.params.siteId });
console.log("houdaa = ",req.params.siteId)
for await (const file of cursor) {
  arrayFiles.push(file);
}
res.json(arrayFiles);
})

// @route   GET /api/uploads/files/download/:filename
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

// @route   DELETE /api/uploads/files/:id
// @desc    Delete File by File ID
// @acces   Private
router.delete("/files/:fileId", auth, async (req, res) => {
  await gfs.db.collection("uploads.chunks").deleteMany({
    files_id: mongoose.Types.ObjectId(req.params.fileId),
  });

  gfs.remove({ _id: req.params.fileId, root: "uploads" }, (err, gridStore) => {
    if (err) {
      return res.status(404).json({ msg: err });
    } else {
      res.json({ msg: "Deleted" });
    }
  });
});


// @route   DELETE /api/uploads/files/:userid
// @desc    Delete all File by user ID
// @acces   Private
router.delete("/files/user/:userId", auth, async (req, res) => {
  gfs.db
    .collection("uploads.files")
    .deleteMany({ clientId: req.params.userId }, (err, gridStore) => {
      if (err) {
        return res.status(404).json({ msg: err });
      } else {
        res.json({ msg: "Deleted" });
      }
    });
});

module.exports = router;
