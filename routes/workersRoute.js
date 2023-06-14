const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Worker = require("../models/workerModel");
const CryptoJS = require("crypto-js");
const config = require("config");

let encryptionKey;

if (process.env.NODE_ENV !== "production") {
  encryptionKey = config.get("encryptionSecretKey");
} else {
  encryptionKey = process.env.encryptionSecretKey;
}

// @Route   GET /api/workers/:clientId
// @Desc    Get workers for a specific client
// @Access   Private
router.get("/:clientId", auth, async (req, res) => {
  try {
    const workers = await Worker.find({ clientId: req.params.clientId });

    for (const worker of workers) {
      // Decrypt
      if (worker.numSocialSecurity) {
        var bytes = CryptoJS.AES.decrypt(
          worker.numSocialSecurity,
          encryptionKey
        );
        worker.numSocialSecurity = bytes.toString(CryptoJS.enc.Utf8);
      }
    }

    if (!workers) {
      res.status(404).json({ msg: "There are no workers" });
    }

    res.json(workers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Couldn't get the workers" });
  }
});

// @Route   GET /api/workers/site/:clientId
// @Desc    Get workers for a specific client
// @Access   Private
router.get("/site/:givensiteId", auth, async (req, res) => {
  try {
    const workers = await Worker.find({ siteId: req.params.givensiteId });

    for (const worker of workers) {
      // Decrypt
      if (worker.numSocialSecurity) {
        var bytes = CryptoJS.AES.decrypt(
          worker.numSocialSecurity,
          encryptionKey
        );
        worker.numSocialSecurity = bytes.toString(CryptoJS.enc.Utf8);
      }
    }

    if (!workers) {
      res.status(404).json({ msg: "There are no workers" });
    }

    res.json(workers);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Couldn't get the workers" });
  }
});

// @Route   POST /api/workers/:clientId
// @Desc    Create a new Worker on the DB
// @Access   Private
router.post("/:clientId", auth, async (req, res) => {
  const { lastName, firstName, birthday } = req.body;

  try {
    worker = new Worker({
      lastName,
      firstName,
      birthday,
      clientId: req.params.clientId,
      siteId: req.body.sites_id,
    });
    await worker.save();
    res.json(worker);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Could not save Worker" });
  }
});

// @Route   DELETE /api/workers/:verifId
// @Desc    Delete a worker from the db
// @Access   Private
router.delete("/:workerId", auth, async (req, res) => {
  try {
    await Worker.findByIdAndDelete(req.params.workerId, (err, docs) => {
      if (err) {
        console.log(err);
        res.status(404).json({ msg: "Could not delete" });
      } else {
        console.log("Deleted Succesfully");
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

// @Route   DELETE /api/workers/user/:userId
// @Desc    Delete a worker from the db
// @Access   Private
router.delete("/user/:userId", auth, async (req, res) => {
  try {
    await Worker.deleteMany({ clientId: req.params.userId }, (err, docs) => {
      if (err) {
        console.log(err);
        res.status(404).json({ msg: "Could not delete" });
      } else {
        console.log("Deleted Succesfully");
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

// @Route   UPDATE /api/workers/:verifId
// @Desc    Updates a worker information
// @Access   Private
router.put("/:workerId", auth, async (req, res) => {
  var { numSocialSecurity, charge, contract, hiringDate } = req.body;

  if (numSocialSecurity) {
    // Encrypt
    numSocialSecurity = CryptoJS.AES.encrypt(
      numSocialSecurity.toString(),
      encryptionKey
    ).toString();
  } else {
    numSocialSecurity = 0;
  }

  try {
    const worker = await Worker.findOneAndUpdate(
      { _id: req.params.workerId },
      { numSocialSecurity, charge, contract, hiringDate },
      { new: true }
    );

    if (!worker) {
      return res.status(404).json({ msg: "Could not update" });
    }

    return res.json(worker);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

// @route   GET /api/workers/fullSuivDossim/:workerId
// @desc    Get all Full Suiv Dossim from a worker in the DB
// @acces   Private
router.get("/fullSuivDossim/:workerId", auth, async (req, res) => {
  let arrayFullSuivDossim = [];
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (worker.length === 0) {
      return res.status(404).json({ msg: "No worker found" });
    }
    for (const Suivi of worker.fullSuivDossim) {
      arrayFullSuivDossim.push(Suivi);
    }
    return res.json(arrayFullSuivDossim);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

// @route   GET /api/workers/sharedactivity/:workerId
// @desc    Get all shared activity from a worker in the DB
// @acces   Private
router.get("/sharedactivity/:workerId", auth, async (req, res) => {
  let arraysharedactivity = [];
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (worker.length === 0) {
      return res.status(404).json({ msg: "No worker found" });
    }
    for (const Suivi of worker.sharedactivity) {
      arraysharedactivity.push(Suivi);
    }
    return res.json(arraysharedactivity);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

// @route   GET /api/workers/complSuivDossim/:workerId
// @desc    Get all Compl Suiv Dossim from a worker in the DB
// @acces   Private
router.get("/complSuivDossim/:workerId", auth, async (req, res) => {
  let arrayComplSuivDossim = [];
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (worker.length === 0) {
      return res.status(404).json({ msg: "No worker found" });
    }
    for (const Suivi of worker.complSuivDossim) {
      arrayComplSuivDossim.push(Suivi);
    }
    return res.json(arrayComplSuivDossim);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/fullSuiviDosim/:workerId
// @Desc    Updates the Full body Suivi Dosimetrique from a worker from the db (Add an especific suivi dosimetrique)
// @Access   Private
router.put("/fullSuivDossim/:workerId", auth, async (req, res) => {
  const { fullSuivDosim } = req.body;

  if (fullSuivDosim === null) {
    return res.json({ msg: "Null Input" });
  }

  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    const index = worker.fullSuivDossim.findIndex((m) => m === fullSuivDosim);

    if (index !== -1) {
      worker.fullSuivDossim[index] = fullSuivDosim;
    } else {
      worker.fullSuivDossim.push(fullSuivDosim);
    }

    const updatedWorker = await worker.save();

    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/sharedactivity/:workerId
// @Desc    Updates the shared activity from a worker from the db (Add an especific shared activity)
// @Access   Private
router.put("/sharedactivity/:workerId", auth, async (req, res) => {
  const { sharedactivitytemp } = req.body;

  if (sharedactivitytemp === null) {
    return res.json({ msg: "Null Input" });
  }

  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    const index = worker.sharedactivity.findIndex(
      (m) => m === sharedactivitytemp
    );

    if (index !== -1) {
      worker.sharedactivity[index] = sharedactivitytemp;
    } else {
      worker.sharedactivity.push(sharedactivitytemp);
    }

    const updatedWorker = await worker.save();

    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/complSuiviDosim/:workerId
// @Desc    Updates the Compl body Suivi Dosimetrique from a worker from the db (Add an especific suivi dosimetrique)
// @Access   Private
router.put("/complSuivDossim/:workerId", auth, async (req, res) => {
  const { complSuivDosim } = req.body;

  if (complSuivDosim === null) {
    return res.json({ msg: "Null Input" });
  }

  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    const index = worker.complSuivDossim.findIndex((m) => m === complSuivDosim);

    if (index !== -1) {
      worker.complSuivDossim[index] = complSuivDosim;
    } else {
      worker.complSuivDossim.push(complSuivDosim);
    }

    const updatedWorker = await worker.save();

    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/fullSuivDossim/:workerId
// @Desc    Updates the Full Suiv Dossim from a Worker from the db (Remove an especific material)
// @Access   Private
router.put("/fullSuivDossim/remove/:workerId", auth, async (req, res) => {
  const { fullSuivDosim } = req.body;

  if (fullSuivDosim === null) {
    return res.json({ msg: "Null Material" });
  }

  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    await Worker.updateOne(
      { _id: req.params.workerId },
      { $pull: { fullSuivDossim: fullSuivDosim } }
    ).exec();

    const updatedVerification = await worker.save();

    res.json(updatedVerification);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/sharedactivity/:workerId
// @Desc    Updates the shared activity from a Worker from the db (Remove especific material)
// @Access   Private
router.put("/sharedactivity/remove/:workerId", auth, async (req, res) => {
  const { sharedactivitytemp } = req.body;
  if (sharedactivitytemp === null) {
    return res.json({ msg: "Null Material" });
  }

  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    await Worker.updateOne(
      { _id: req.params.workerId },
      { $pull: { sharedactivity: sharedactivitytemp } }
    ).exec();

    const updatedVerification = await worker.save();

    res.json(updatedVerification);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/complSuivDossim/:workerId
// @Desc    Updates the Compl Suiv Dosim from a worker from the db (Remove an especific material)
// @Access   Private
router.put("/complSuivDossim/remove/:workerId", auth, async (req, res) => {
  const { complSuivDosim } = req.body;

  if (complSuivDosim === null) {
    return res.json({ msg: "Null Material" });
  }

  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    await Worker.updateOne(
      { _id: req.params.workerId },
      { $pull: { complSuivDossim: complSuivDosim } }
    ).exec();

    const updatedVerification = await worker.save();

    res.json(updatedVerification);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/fullSuivDossim/clear/:workerId
// @Desc    Updates the Full Suiv Dossim from a worker from the db (Clear all materials)
// @Access   Private
router.put("/fullSuivDossim/clear/:workerId", auth, async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    await Worker.updateOne(
      { _id: req.params.workerId },
      { $set: { fullSuivDossim: [] } }
    ).exec();

    const updatedWorker = await worker.save();

    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/sharedactivity/clear/:workerId
// @Desc    Updates the shared activity from a worker from the db (Clear all materials)
// @Access   Private
router.put("/sharedactivity/clear/:workerId", auth, async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    await Worker.updateOne(
      { _id: req.params.workerId },
      { $set: { sharedactivity: [] } }
    ).exec();

    const updatedWorker = await worker.save();

    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/workers/complSuivDossim/clear/:workerId
// @Desc    Updates the Compl Suiv Dossim from a worker from the db (Clear all materials)
// @Access   Private
router.put("/complSuivDossim/clear/:workerId", auth, async (req, res) => {
  try {
    const worker = await Worker.findOne({
      _id: req.params.workerId,
    });

    if (!worker) {
      return res.status(404).json({ msg: "Worker not found" });
    }

    await Worker.updateOne(
      { _id: req.params.workerId },
      { $set: { complSuivDossim: [] } }
    ).exec();

    const updatedWorker = await worker.save();

    res.json(updatedWorker);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
