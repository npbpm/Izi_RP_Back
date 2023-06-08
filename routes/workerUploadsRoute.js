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
  gfs.collection("workerUploads");
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
          bucketName: "workerUploads",
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

// @route   GET /api/workers/uploads/files/RPTE/:workerId
// @desc    Get file from the DB by workerId
// @acces   Private
router.get("/files/RPTE/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "RPTE",
    });

    if (!file || file.length === 0) {
      return res.json({ filename: "", date: "" });
    }

    return res.json(file);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

// @route   GET /api/workers/uploads/files/RPP/:workerId
// @desc    Get file from the DB by workerId
// @acces   Private
router.get("/files/RPP/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "RPP",
    });

    if (!file || file.length === 0) {
      return res.json({ filename: "", date: "" });
    }

    return res.json(file);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

// @route   GET /api/workers/uploads/files/Visite/:workerId
// @desc    Get file from the DB by workerId
// @acces   Private
router.get("/files/Visite/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "Visite",
    });

    if (!file || file.length === 0) {
      return res.json({ filename: "", date: "" });
    }

    return res.json(file);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

// @route   GET /api/workers/uploads/files/Eval/:workerId
// @desc    Get file from the DB by workerId
// @acces   Private
router.get("/files/Eval/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "Eval",
    });

    if (!file || file.length === 0) {
      return res.json({ filename: "", date: "" });
    }

    return res.json(file);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

// @route   POST /api/workers/uploads
// @desc    Upload file to the DB
// @acces   Private
router.post("/", auth, upload.single("file"), (req, res) => {
  const workerId = req.body.workerId;
  const file_type = req.body.file_type;

  //Associates the clientId & workerId to every single file uploaded
  gfs.files.update(
    { filename: `${req.file.filename}` },
    { $set: { clientId: req.client.id, workerId, file_type } }
  );

  res.json(req.file);
});

// @route   DELETE /api/workers/uploads/files/RPTE/:workerId
// @desc    Delete RPTE File by workerId
// @acces   Private
router.delete("/files/RPTE/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "RPTE",
    });
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    await gfs.db.collection("workerUploads.chunks").deleteMany({
      files_id: mongoose.Types.ObjectId(file._id),
    });

    await gfs.files.deleteOne({
      workerId: file.workerId,
    });

    res.json({ msg: "File Deleted" });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

// @route   DELETE /api/workers/uploads/files/RPPP/:workerId
// @desc    Delete RPTE File by workerId
// @acces   Private
router.delete("/files/RPP/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "RPP",
    });
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    await gfs.db.collection("workerUploads.chunks").deleteMany({
      files_id: mongoose.Types.ObjectId(file._id),
    });

    await gfs.files.deleteOne({
      workerId: file.workerId,
    });

    res.json({ msg: "File Deleted" });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

// @route   DELETE /api/workers/uploads/files/Visite/:workerId
// @desc    Delete RPTE File by workerId
// @acces   Private
router.delete("/files/Visite/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "Visite",
    });
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    await gfs.db.collection("workerUploads.chunks").deleteMany({
      files_id: mongoose.Types.ObjectId(file._id),
    });

    await gfs.files.deleteOne({
      workerId: file.workerId,
    });

    res.json({ msg: "File Deleted" });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

// @route   DELETE /api/workers/uploads/files/Eval/:workerId
// @desc    Delete RPTE File by workerId
// @acces   Private
router.delete("/files/Eval/:workerId", auth, async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "Eval",
    });
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: "No file exists",
      });
    }

    await gfs.db.collection("workerUploads.chunks").deleteMany({
      files_id: mongoose.Types.ObjectId(file._id),
    });

    await gfs.files.deleteOne({
      workerId: file.workerId,
    });

    res.json({ msg: "File Deleted" });
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

// @route   DELETE /api/workers/uploads/files/:workerId
// @desc    Delete all files from a workerId
// @acces   Private
router.delete("/files/:workerId", auth, async (req, res) => {
  try {
    const files = await gfs.files.find({ workerId: req.params.workerId });

    const filesArray = await files.toArray();

    for (let file of filesArray) {
      await gfs.db.collection("workerUploads.chunks").deleteMany({
        files_id: mongoose.Types.ObjectId(file._id),
      });

      await gfs.files.deleteMany({
        workerId: file.workerId,
      });
    }

    res.json({ msg: "Files Deleted" });
  } catch (error) {
    res.status(404).json({ msg: "There was an error deleting all files" });
    console.log(error);
  }
});

// @route   GET /api/workers/uploads/files/RPTE/download/:workerId
// @desc    Download RPTE File by workerId
// @acces   Public
router.get("/files/RPTE/download/:workerId", async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "RPTE",
    });
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

// @route   GET /api/workers/uploads/files/RPP/download/:workerId
// @desc    Download RPP File by workerId
// @acces   Public
router.get("/files/RPP/download/:workerId", async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "RPP",
    });
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

// @route   GET /api/workers/uploads/files/Visite/download/:workerId
// @desc    Download RPTE File by workerId
// @acces   Public
router.get("/files/Visite/download/:workerId", async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "Visite",
    });
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

// @route   GET /api/workers/uploads/files/RPTE/download/:workerId
// @desc    Download RPTE File by workerId
// @acces   Public
router.get("/files/Eval/download/:workerId", async (req, res) => {
  try {
    const file = await gfs.files.findOne({
      workerId: req.params.workerId,
      file_type: "Eval",
    });
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

module.exports = router;
