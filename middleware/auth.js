const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  let jwtSecret;

  if (process.env.NODE_ENV !== "production") {
    jwtSecret = config.get("jwtSecret");
  } else {
    jwtSecret = process.env.jwtSecret;
  }

  console.log("THIS IS THE SECRET");
  console.log(jwtSecret);
  console.log(typeof jwtSecret);

  //Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    console.log("THIS IS THE TOKEN");
    console.log(token);

    console.log("DECODED");
    console.log(decoded);

    req.client = decoded.client;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
