const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Site = require("../models/siteModel");

//@Route    /api/equipments/:givenstructure
//@Desc     Get all equipments for a specific siteId
//@Access   Private
router.get("/:givenstructure", auth, async (req, res) => {
  //Checking if the request was sent by an admin or not
  const { authorization } = req.body;

  try {
    let users = await Site.find({ structureId: req.params.givenstructure });

    res.json(users);
  } catch (error) {
    res.status(400).json({ msg: "Problem retrieving Structure" });
  }
});

//@Route    /api/site/
//@Desc     Post a new site to the DB
//@Access   Private
router.post("/", auth, async (req, res) => {
  const { entry, info } = req.body;
  const site = new Site({
    name: entry,
    structureId: info,
    clientId: req.client.id,
  });

  //Save the new client to the database with the password completely hashed
  await site.save();
});

//@Route    /api/site/structure/:structure
//@Desc     Delete a site that has a specific structure
//@Access   Private
router.delete("/structure/:structure", auth, async (req, res) => {
  try {
    await Site.deleteMany({ structureId: req.params.structure });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

//@Route    /api/site/:sitename
//@Desc     Delete a site that has a specific sitename
//@Access   Private
router.delete("/:sitename", auth, async (req, res) => {
  try {
    console.log("erreur ?");
    await Site.remove({ _id: req.params.sitename });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

router.put("/:sitename", auth, async (req, res) => {
  var { givenname } = req.body;
  console.log(req.params.sitename);
  try {
    const site = await Site.findOneAndUpdate(
      { _id: req.params.sitename },
      { name: givenname }
    );

    return res.json(worker);
  } catch (error) {
    res.status(404).json({ msg: error });
  }
});

module.exports = router;
