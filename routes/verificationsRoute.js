const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Verification = require("../models/verificationModel");

// @Route   GET /api/verifications/:clientId
// @Desc    Get verifications for a specific client
// @Access   Private
router.get("/:clientId", auth, async (req, res) => {
  try {
    const verifs = await Verification.find({ clientId: req.params.clientId });

    if (!verifs) {
      res.status(404).json({ msg: "There are no verifications" });
    }

    res.json(verifs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Couldn't get the verifications" });
  }
});

// @Route   GET /api/verifications/site/:siteId
// @Desc    Get verifications for a specific client
// @Access   Private
router.get("/site/:givensiteId", auth, async (req, res) => {
  try {
    const verifs = await Verification.find({ siteId: req.params.givensiteId });

    if (!verifs) {
      res.status(404).json({ msg: "There are no verifications" });
    }

    res.json(verifs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Couldn't get the verifications" });
  }
});

// @Route   POST /api/verifications/:clientId
// @Desc    Create a new Verification on the DB
// @Access   Private
router.post("/:clientId", auth, async (req, res) => {
  const { name, conformity, year, type } = req.body;

  try {
    let verif = await Verification.find({ name });

    if (verif.length !== 0) {
      return res
        .status(404)
        .json({ msg: "There already exists a verification with this name" });
    }

    verif = new Verification({
      type,
      year,
      name,
      conformity,
      clientId: req.params.clientId,
      siteId:req.body.sites_id,
      structureId:req.body.structure_id
    });

    await verif.save();
    res.json(verif);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Could not save Verification" });
  }
});

// @Route   DELETE /api/verifications/:verifId
// @Desc    Delete a verification from the db
// @Access   Private
router.delete("/:verifId", auth, async (req, res) => {
  try {
    await Verification.findByIdAndDelete(req.params.verifId, (err, docs) => {
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

// @Route   UPDATE /api/verifications/:verifId
// @Desc    Updates the conformity from a verification from the db
// @Access   Private
router.put("/:verifId", auth, async (req, res) => {
  const { conformity } = req.body;

  try {
    const docs = await Verification.findOneAndUpdate(
      { _id: req.params.verifId },
      { conformity },
      { new: true }
    );

    if (!docs) {
      return res.status(404).json({ msg: "Could not update" });
    }

    res.json(docs);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

// @route   GET /api/verifications/uploads/materials/:cerifId
// @desc    Get all materials from an especific verifiation from the DB corresponding to the clientID
// @acces   Private
router.get("/materials/:verifId", auth, async (req, res) => {
  let arrayMaterials = [];
  try {
    const verification = await Verification.findOne({
      _id: req.params.verifId,
    });
    if (verification.length === 0) {
      return res.status(404).json({ msg: "No verification found" });
    }
    for (const material of verification.materials) {
      arrayMaterials.push(material);
    }
    return res.json(arrayMaterials);
  } catch (error) {
    return res.status(404).json({ msg: error });
  }
});

// @Route   UPDATE /api/verifications/:verifId
// @Desc    Updates the materials from a verification from the db (Add an especific material)
// @Access   Private
router.put("/materials/:verifId", auth, async (req, res) => {
  const { material } = req.body;

  if (material === null) {
    return res.json({ msg: "Null Material" });
  }

  try {
    const verification = await Verification.findOne({
      _id: req.params.verifId,
    });

    if (!verification) {
      return res.status(404).json({ msg: "Verification not found" });
    }

    const index = verification.materials.findIndex((m) => m === material);

    if (index !== -1) {
      verification.materials[index] = material;
    } else {
      verification.materials.push(material);
    }

    const updatedVerification = await verification.save();

    res.json(updatedVerification);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/verifications/:verifId
// @Desc    Updates the materials from a verification from the db (Remove an especific material)
// @Access   Private
router.put("/materials/remove/:verifId", auth, async (req, res) => {
  const { material } = req.body;

  if (material === null) {
    return res.json({ msg: "Null Material" });
  }

  try {
    const verification = await Verification.findOne({
      _id: req.params.verifId,
    });

    if (!verification) {
      return res.status(404).json({ msg: "Verification not found" });
    }

    await Verification.updateOne(
      { _id: req.params.verifId },
      { $pull: { materials: material } }
    ).exec();

    const updatedVerification = await verification.save();

    res.json(updatedVerification);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   UPDATE /api/verifications/:verifId
// @Desc    Updates the materials from a verification from the db (Clear all materials)
// @Access   Private
router.put("/materials/clear/:verifId", auth, async (req, res) => {
  try {
    const verification = await Verification.findOne({
      _id: req.params.verifId,
    });

    if (!verification) {
      return res.status(404).json({ msg: "Verification not found" });
    }

    await Verification.updateOne(
      { _id: req.params.verifId },
      { $set: { materials: [] } }
    ).exec();

    const updatedVerification = await verification.save();

    res.json(updatedVerification);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// @Route   DELETE /api/verifications/user/:userId
// @Desc    Delete a verification from the db
// @Access   Private
router.delete("/user/:userId", auth, async (req, res) => {
  try {
    await Verification.deleteMany({clientId:req.params.userId}, (err, docs) => {
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

// @Route   DELETE /api/verifications/site/:givensiteId
// @Desc    Delete a verification from the db
// @Access   Private
router.delete("/site/:givensiteId", auth, async (req, res) => {
  try {
    await Verification.deleteMany({siteId:req.params.givensiteId}, (err, docs) => {
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

module.exports = router;
