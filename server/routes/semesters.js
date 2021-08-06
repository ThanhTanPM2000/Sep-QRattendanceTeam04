const express = require("express");
const _ = require("lodash");

const auth = require("../middleware/auth");
const moment = require("moment");
const { Semesters, validateSemester } = require("../models/semesters");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Classes } = require("../models/classes");

const router = express.Router();

router.get("/", async (req, res) => {
  const semester = await Semesters.find();
  res.send(semester);
});

router.get("/:id", async (req, res) => {
  let semester = await Semesters.findOne({ semesterId: req.body.semesterId });
  res.send(semester);
});

router.post("/", [validate(validateSemester), auth], async (req, res) => {
  var io = req.app.get("socketIo");

  const editor = req.user;

  let semester = await Semesters.findOne({ symbol: req.body.symbol });
  if (semester) return res.status(400).send("Symbol Semester already exists");

  semester = new Semesters({
    ..._.pick(req.body, ["name", "year", "symbol"]),
    editor: `${editor.mail} (${editor.role})`,
    lastUpdated: moment().locale("vi").format("L LTS"),
  });

  await semester.save();

  const semesters = await Semesters.find();
  io.emit("getNewSemesters", semesters);
  res.send(semester);
});

router.put(
  "/:id",
  [validateObjectId, validate(validateSemester), auth],
  async (req, res) => {
    const editor = req.user;

    let semester = await Semesters.findOne({ symbol: req.body.symbol });

    var io = req.app.get("socketIo");

    semester = await Semesters.findByIdAndUpdate(
      req.params.id,
      {
        ..._.pick(req.body, ["name", "year", "symbol"]),
        editor: `${editor.mail} (${editor.role})`,
        lastUpdated: moment().locale("vi").format("L LTS"),
      },
      { new: true }
    );

    if (!semester)
      return res
        .status(404)
        .send("The Semester with th given Id was not found");

    const semesters = await Semesters.find();
    io.emit("getNewSemesters", semesters);

    res.send(semester);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const classes = await Classes.findOne({ "semester._id": req.params.id });

  var io = req.app.get("socketIo");

  if (classes) {
    return res
      .status(400)
      .send(
        "Somewhere still have this semester, please delete that first then come back"
      );
  }

  const semester = await Semesters.findByIdAndDelete(req.params.id);

  if (!semester)
    return res.status(404).send("The Semester with the given ID was not found");

  const semesters = await Semesters.find();
  io.emit("deleteSemester", semesters);

  res.send("Delete successfully");
});

module.exports = router;
