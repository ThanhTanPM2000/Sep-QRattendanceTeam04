const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("../utils/transaction");

const { Students, validateStudent } = require("../models/students");
const { Classes } = require("../models/classes");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Students.find();
  res.send(students);
});

router.get("/:id", async (req, res) => {
  const student = await Students.findById(req.params.id);
  if (!student) return res.status(404).send("Student not found");
  res.send(student);
});

router.post("/", validate(validateStudent), async (req, res) => {
  const { studentId, name, mail } = req.body;

  var io = req.app.get("socketIo");

  let student = await Students.findOne({ mail });
  if (student) return res.status(400).send("Student already registered");

  student = await Students.findOne({ studentId });
  if (student) return res.status(400).send("Student Id was exist");

  let classes = await Classes.find({
    "lessons.0.students": { $elemMatch: { mail } },
  });

  student = new Students({
    studentId,
    name,
    mail,
    classes,
    history: [],
  });

  try {
    const task = new Fawn.Task();
    task.save("students", student);
    classes.forEach((x) => {
      task.update(
        "classes",
        { _id: x._id },
        {
          $pull: {
            "lessons.$[].students": {
              mail,
            },
          },
        }
      );
      task.update(
        "classes",
        { _id: x._id },
        {
          $push: {
            "lessons.$[].students": {
              mail,
              name,
              studentId,
              status: "Not Attended",
            },
          },
        }
      );
    });
    await task.run({ useMongoose: true });
    const newClasses = await Classes.find();
    io.emit("getNewClasses", newClasses);
    const token = student.generateAuthToken();
    res.header("x-auth-token", token).send(token);
  } catch (error) {
    console.log(error);
    res.status(500).send("Something failed to server");
  }
});

router.put(
  "/:id",
  [validateObjectId, validate(validateStudent)],
  async (req, res) => {
    const student = await Students.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, ["mail, studentId, name"]),
      { new: true }
    );

    if (!student)
      return res
        .status(404)
        .send("The Student with given ID was not found in DB");

    res.send(student);
  }
);

router.put("/deleteHistory/:id", async (req, res) => {
  const { mail, _id, time, title, description } = req.body;
  const { id } = req.params.id;

  const student = await Students.findOneAndUpdate(
    { mail },
    { $pull: { history: { _id } } }
  );
  console.log(student);
  if (!student) return res.status(400).send("Student not found");
  res.send(student);
});

router.delete("/:id", [validateObjectId], async (req, res) => {
  const student = await Students.findByIdAndDelete(req.params.id);
  if (!student)
    return res
      .status(404)
      .send("The Student with given ID was not found in DB");

  try {
    const task = new Fawn.Task();
    task.update("classes");
  } catch (error) {}

  res.send("Delete Successfully");
});

module.exports = router;
