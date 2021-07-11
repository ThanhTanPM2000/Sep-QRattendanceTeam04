const express = require("express");
const _ = require("lodash");

const { Semesters, validateSemester } = require("../models/semesters");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/", async (req, res) => {
  const semester = await Semesters.find();
  res.send(semester);
});

router.get("/:id", async (req, res) => {
  let semester = await Semesters.findOne({ semesterId: req.body.semesterId });
  res.send(semester);
});

router.post("/", validate(validateSemester), async (req, res) => {
  let semester = await Semesters.findOne({ symbol: req.body.symbol });
  if (semester) return res.status(400).send("Symbol Semester already exists");

  semester = new Semesters(_.pick(req.body, ["name", "year", "symbol"]));

  await semester.save();
  res.send(semester);
});

router.put(
  "/:id",
  [validateObjectId, validate(validateSemester)],
  async (req, res) => {
    let semester = await Semesters.findOne({ symbol: req.body.symbol });
    if (semester) return res.status(400).send("Symbol Semester already exists");

    semester = await Semesters.findByIdAndUpdate(
      req.params.id,
      {
        ..._.pick(req.body, ["name", "year", "symbol"]),
      },
      { new: true }
    );

    if (!semester)
      return res
        .status(404)
        .send("The Semester with th given Id was not found");

    res.send(semester);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const semester = await Semesters.findByIdAndDelete(req.params.id);

  if (!semester)
    return res.status(404).send("The Semester with the given ID was not found");

  res.send("Delete successfully");
});

module.exports = router;
