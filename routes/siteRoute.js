const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Site = require("../models/siteModel");

router.get("/:givenstructure", auth, async (req, res) => {
  //Checking if the request was sent by an admin or not
  const { authorization } = req.body;

  try {
    let users = await Site.find({ structurename: req.params.givenstructure });

    res.json(users);
  } catch (error) {
    res.status(400).json({ msg: "Problem retrieving Structure" });
  }
});

router.post("/", auth, async (req, res) => {
  const { entry, info } = req.body;
  const site = new Site({
    name: entry,
    structurename: info,
    clientId: req.client.id,
  });

  //Save the new client to the database with the password completely hashed
  await site.save();
});

router.delete("/structure/:structure", auth, async (req, res) => {
  try {
    await Site.deleteMany({ structurename: req.params.structure });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

router.delete("/:sitename", auth, async (req, res) => {
      try {
        console.log("erreur ?")
        await Site.remove({name:req.params.sitename});
      } catch (error) {
        res.status(500).json({ msg: "An error occured while deleting" });
        console.log(error);
      }
    });

router.put("/:sitename", auth, async (req, res) => {
      var { givenname} = req.body;
    
      try {
        const site = await Site.findOneAndUpdate(
          { name: req.params.sitename },
          { name:givenname},
          { new: true }
        );
    
    
        return res.json(worker);
      } catch (error) {
        res.status(404).json({ msg: error });
      }
    });

module.exports = router;
