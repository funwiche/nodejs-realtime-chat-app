const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  //   console.log("Cookies: ", req.cookies);
  res.render("index");
});
router.get("/chat", (req, res) => res.render("chat"));

module.exports = router;
