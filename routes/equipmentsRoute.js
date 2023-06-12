const express = require("express");
const router = express.Router();
const Equipment = require("../models/equipmentModel");
const auth = require("../middleware/auth");

//@Route    /api/equipments
//@Desc     Get all the equipments for a specific clientId
//@Access   Private
router.get("/:clientId", auth, async (req, res) => {
  try {
    const equipments = await Equipment.find({ clientId: req.params.clientId });

    if (!equipments) {
      res.status(404).json({ msg: "There are no equipments" });
    }

    res.json(equipments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Couldn't get the equipments" });
  }
});

//@Route    /api/equipments/
//@Desc     Post a new equipment to the DB
//@Access   Private
router.post("/", auth, async (req, res) => {
  const { name, brand, type, year, category, clientId, modelType } = req.body;

  try {
    equipment = new Equipment({
      name,
      brand,
      type,
      year,
      category,
      clientId,
      modelType,
      siteId:req.body.sites_id
    });

    await equipment.save();
    res.json(equipment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Could not upload the equipment to the DB" });
  }
});

// @Route   UPDATE /api/equipments/
// @Desc    Updates an equipment information
// @Access   Private
router.put("/", auth, async (req, res) => {
  var { MaterialId, brand, model, years } = req.body;

  try {
    const equipment = await Equipment.findOneAndUpdate(
      { _id: MaterialId },
      { brand, modelType: model, year: years },
      { new: true }
    );

    if (!equipment) {
      return res.status(404).json({ msg: "Could not update" });
    }

    return res.json(equipment);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

//@Route    /api/equipments
//@Desc     Delete an equipment using the equipmentId
//@Access   Private
router.delete("/:equipmentId", auth, async (req, res) => {
  try {
    await Equipment.findByIdAndDelete(req.params.equipmentId, (err, docs) => {
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
//@Route    /api/equipments/user
//@Desc     Delete an equipment using the equipmentId
//@Access   Private
router.delete("/user/:userId", auth, async (req, res) => {
  try {
    await Equipment.deleteMany({ clientId: req.params.userId }, (err, docs) => {
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
