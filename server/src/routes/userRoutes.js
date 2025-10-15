const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Posts endpoint working" });
});

module.exports = router;
