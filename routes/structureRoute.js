const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Structure = require("../models/structureModel");

//@Route    /api/structure
//@Desc     GET all structure from DB
//@Access   Private
router.get("/", auth, async (req, res) => {
  //Checking if the request was sent by an admin or not
  const { authorization } = req.body;

  try {
    let users = await Structure.find({ clientId: "test" });

    res.json(users);
  } catch (error) {
    res.status(400).json({ msg: "Problem retrieving Structure" });
  }
});

//@Route    /api/structure
//@Desc     POST a structure in DB
//@Access   Private
router.post("/", auth, async (req, res) => {
  const { entry } = req.body;
  structure = new Structure({
    name: entry,
    clientId: "test",
  });

  try {
    setTimeout(() => {
      structure.save();
    }, 100);

    res.json(structure);
  } catch (error) {
    console.log(error);
    res.json({ msg: "Error saving the structure" });
  }
});

//@Route     /api/structure/:structurename
//Desc       DELETE a specific structure by its structurename
//@Access    private
router.delete("/:structurename", auth, async (req, res) => {
  try {
    await Structure.remove({ _id: req.params.structurename });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

//@Route    /api/structure/:structurename
//@Desc     update a structure information
//@Access   Private
router.put("/:structurename", auth, async (req, res) => {
  var { givenname } = req.body;

  try {
    const structure = await Structure.findOneAndUpdate(
      { _id: req.params.structurename },
      { name: givenname },
      { new: true }
    );

    return res.json(worker);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

module.exports = router;
