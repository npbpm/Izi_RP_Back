const express = require("express");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require("bcryptjs");
const Client = require("../models/clientModel");

let jwtSecret;

if (process.env.NODE_ENV !== "production") {
  jwtSecret = config.get("jwtSecret");
} else {
  jwtSecret = process.env.jwtSecret;
}

//@Route    /api/connexion
//@Desc     Auth client & get Token
//@Access   Public
router.post(
  "/",
  [
    check("mail", "Please enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { mail, password } = req.body;

    try {
      //Look for the user inside the database
      let client = await Client.findOne({ email: mail });

      if (!client) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      //Compare passwords
      const isMatch = await bcrypt.compare(password, client.password);

      if (!isMatch) {
        return res.status(401).json({ msg: "Invalid Credentials" });
      }

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
          res.json({ token, authorization: true, firstConn: client.firstConn });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
