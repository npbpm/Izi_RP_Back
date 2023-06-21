const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const Client = require("../models/clientModel");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

let jwtSecret;

if (process.env.NODE_ENV !== "production") {
  jwtSecret = config.get("jwtSecret");
} else {
  jwtSecret = process.env.jwtSecret;
}

//@Route    /api/user/USERMAIL
//@Desc     Get Currently Connected Client by Email
//@Access   public
router.get("/:mail", async (req, res) => {
  try {
    let client = await Client.findOne({ email: req.params.mail }).select(
      "-password"
    );

    if (!client) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    res.send(client);
  } catch (error) {
    console.log(error);
  }
});

//@Route    /api/user/structure/:structurename
//@Desc     Get Currently Connected Client by Email
//@Access   Private
router.get("/structure/:structurename", auth, async (req, res) => {
  try {
    let client = await Client.find({
      structure: req.params.structurename,
    }).select("-password");

    if (!client) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }
    res.send(client);
  } catch (error) {}
});

//@Route    /api/user/personalData/:clientId
//@Desc     Route used to change the client password, from the profile tab
//@Access   Private
router.post("/personalData/:clientId", auth, async (req, res) => {
  const { oldPassword } = req.body;

  try {
    let client = await Client.findOne({ _id: req.params.clientId });

    if (!client) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    //Compare passwords
    const isMatch = await bcrypt.compare(oldPassword, client.password);

    if (isMatch) res.send({ match: true });
    else res.send({ match: false });
  } catch (error) {
    console.log(error);
  }
});

//@Route    /api/user/clients
//@Desc     Get all DB clients
//@Access   Private
//,[check("authorization", "Please send the authorization value").exists()]
router.get("/", auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  //Checking if the request was sent by an admin or not
  const { authorization } = req.body;

  //    if (authorization !== "true") {
  //  return res.status(401).json({ msg: "Access Denied" });
  //  }

  try {
    let users = await Client.find({ admin: false }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(400).json({ msg: "Problem retrieving clients" });
  }
});

//@Route    /api/user
//@Desc     Create a new Client
//@Access   Public
router.post(
  "/",
  [check("mail", "Please add a valid Email").isEmail()],
  auth,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mail, name, lastname, admin, structure, structureId, site } =
      req.body;

    //Look for the user inside the database
    try {
      let client = await Client.findOne({ email: mail }).select("-password");

      if (client) {
        return res.status(400).json({ msg: "Client already exists" });
      }

      //We generate a random string as password, for the first connection, after it the client will have to change it.
      password = Math.random().toString(36).slice(-8);
      client = new Client({
        email: mail,
        firstName: name,
        lastName: lastname,
        structure: structure,
        structureId: structureId,
        site: site,
        password,
        admin,
        firstConn: true,
      });

      //Hash the password
      const salt = await bcrypt.genSalt(10);

      client.password = await bcrypt.hash(password, salt);

      //Save the new client to the database with the password completely hashed
      await client.save();

      const payload = {
        client: {
          id: client.id,
        },
      };

      jwt.sign(
        payload,
        jwtSecret,
        {
          expiresIn: 1200,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ mail, password });
        }
      );
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

//@Route    /api/user/:userId
//@Desc     PUT Change password
//@Access   Private
router.put(
  "/:userId",
  auth,
  [check("password", "Password is required").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { password, adminGeneration } = req.body;

    try {
      let client = await Client.findOne({
        _id: mongoose.Types.ObjectId(req.params.userId),
      }).select("-password");

      if (!client) {
        return res.json({ msg: "Client not found" });
      }

      //Hash the password
      const salt = await bcrypt.genSalt(10);

      let newPassword = await bcrypt.hash(password, salt);

      if (adminGeneration) {
        await Client.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(req.params.userId) },
          { password: newPassword, firstConn: true }
        );
      } else {
        await Client.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(req.params.userId) },
          { password: newPassword, firstConn: false }
        );
      }

      res.json({ msg: "Password Updated" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: "Couldn't update the password" });
    }
  }
);

//@Route    /api/user/personalData/:userId
//@Desc     PUT Change password
//@Access   Private
router.put("/personalData/:userId", auth, async (req, res) => {
  const { firstName_, lastName_ } = req.body;

  try {
    await Client.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(req.params.userId) },
      { firstName: firstName_, lastName: lastName_ }
    );
    res.json({ msg: "Personal Data modified" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Couldn't update the user" });
  }
});

//@Route    /api/user/:email
//@Desc     Delete a user using email
//@Access   Private
router.delete("/:email", auth, async (req, res) => {
  try {
    await Client.remove({ email: req.params.email });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

//@Route    /api/user/structure/:Sname
//@Desc     Delete a user using structureId
//@Access   Private
router.delete("/structure/:SName", auth, async (req, res) => {
  try {
    await Client.deleteMany({ structureId: req.params.SName });
  } catch (error) {
    res.status(500).json({ msg: "An error occured while deleting" });
    console.log(error);
  }
});

module.exports = router;
