const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Semesters } = require("../models/semesters");

const validate = require("../middleware/validate");
const { Classes, validateClass } = require("../models/classes");
const validateObjectId = require("../middleware/validateObjectId");
const { Users } = require("../models/users");

const router = express.Router();

router.get("/", async (req, res) => {
  const classes = await Classes.find();
  res.send(classes);
});

router.get("/:id", async (req, res) => {
  let classOne = await Classes.findOne({ _id: req.params.id });
  res.send(classOne);
});

function generateLessons(numOfWeek) {
  let lessons = [];
  let num = numOfWeek;
  for (var i = 1; i <= num; i++) {
    if (num > 0) {
      lessons.push({
        order: i,
        students: [],
        numOfAttendance: 0,
        numOfNonAttendance: 0,
        codeAttendance: 2,
      });
    }
  }

  return lessons;
}

router.post("/", validate(validateClass), async (req, res) => {
  const {
    classTermId,
    name,
    numOfCredits,
    courseType,
    schoolYear,
    startDate,
    endDate,
    room,
    dayOfWeek,
    numOfWeek,
    semesterSymbol,
    lecturerMail,
  } = req.body;

  const semester = await Semesters.findOne({ symbol: semesterSymbol });
  if (!semester) return res.status(400).send("Semester not found");

  const lecturer = await Users.findOne({ mail: lecturerMail });
  if (!lecturer) return res.status(400).send("Invalid Lecturer");

  const classes = new Classes({
    classTermId,
    name,
    numOfCredits,
    courseType,
    schoolYear,
    startDate,
    endDate,
    room,
    dayOfWeek,
    numOfWeek,
    semester: {
      name: semester.name,
      symbol: semester.symbol,
      year: semester.year,
    },
    lecturer: {
      lecturerId: lecturer.userId,
      degree: lecturer.degree,
      name: lecturer.name,
    },
    lessons: generateLessons(numOfWeek),
  });

  await classes.save();
  res.send(classes);
});

// router.put(
//   "/:id",
//   [validateObjectId, validate(validateSemester)],
//   async (req, res) => {
//     const semester = await Semesters.findByIdAndUpdate(
//       req.params.id,
//       _pick(req.body, ["acronym", "semesterName", "years"]),
//       { new: true }
//     );

//     if (!semester)
//       return res
//         .status(404)
//         .send("The Semester with th given Id was not found");

//     res.send(semester);
//   }
// );

// router.delete("/:id", validateObjectId, async (req, res) => {
//   const semester = await Semesters.findById(req.params.id);

//   if (!semester)
//     return res.status(404).send("The Semester with the given ID was not found");

//   const result = await Semesters.remove(semester);
//   res.send(result);
// });

module.exports = router;
