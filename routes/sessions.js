const express = require("express");
const router = express.Router();

const session = {
  name: "buoi 1",
};

router.get("/", (req, res, next) => {
  res.send(session.name);
});

// req = request res = response
router.post("/", (req, res, next) => {
  res.send(req.body);
  //   res.send("day la method post");
});

router.put("/", (req, res, next) => {
  session.name = req.body.name;
  res.send(session.name);
});

router.delete("/", (req, res, next) => {
  res.send("day la method delete");
});

module.exports = router;

// req tu client ve no 2 phan
