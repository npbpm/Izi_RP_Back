const express = require("express");
const router = express.Router();
const mailer = require("../config/mailing");

//@Route    /api/email
//@Desc     send the email using mailer and input contact params
//@Access   public
router.post("/", (req,res) => {

const { userMail, message, firstName, lastName } = req.body;

  const mailSent = mailer(userMail, message, firstName, lastName);

  if (mailSent) {
    res.json({ msg: "Mail sent succesfully" });
  } else {
    res.status(500);
  }
});

module.exports = router;
