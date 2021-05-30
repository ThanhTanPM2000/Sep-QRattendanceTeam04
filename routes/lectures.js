const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Hello lectures");
});

// req = request res = response
router.post("/", (req, res, next) => {
  res.send("");
  //   res.send("day la method post");
});

router.put("/", (req, res, next) => {
  console.log("1");
  res.send("hei");
});

router.delete("/", (req, res, next) => {
  res.send("day la method delete");
});

module.exports = router;
