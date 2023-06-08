const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Structure = require("../models/structureModel");

router.get("/", auth, async (req, res) => {
  //Checking if the request was sent by an admin or not
  const { authorization } = req.body;

  //    if (authorization !== "true") {
  //  return res.status(401).json({ msg: "Access Denied" });
  //  }

  try {
    let users = await Structure.find({ clientId: "test" });

    res.json(users);
  } catch (error) {
    res.status(400).json({ msg: "Problem retrieving Structure" });
  }
});

router.post("/", auth, async (req, res) => {
  const { entry } = req.body;
  structure = new Structure({
    name: entry,
    clientId: "test",
  });
  console.log("testdsada");
  //Save the new client to the database with the password completely hashed
  try {
    setTimeout(() => {
      structure.save();
    }, 100);
  } catch (error) {}
});

router.delete("/:structurename", auth, async (req, res) => {
  try {
    console.log("erreur ?");
    await Structure.remove({ name: req.params.structurename });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

router.put("/:structurename", auth, async (req, res) => {
  var { givenname } = req.body;

  console.log(givenname);
  try {
    const structure = await Structure.findOneAndUpdate(
      { name: req.params.structurename },
      { name: givenname },
      { new: true }
    );

    return res.json(worker);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

module.exports = router;
