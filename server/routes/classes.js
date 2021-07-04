const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Semesters } = require("../models/semesters");
const Fawn = require("../utils/transaction");

const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const {
  Classes,
  validateClass,
  validateStudentInClass,
} = require("../models/classes");
const { Users } = require("../models/users");
const { Students } = require("../models/students");

const router = express.Router();

router.get("/", async (req, res) => {
  const classes = await Classes.find();
  res.send(classes);
});

router.get("/:id", async (req, res) => {
  let classOne = await Classes.findOne({ _id: req.params.id });
  res.send(classOne);
});

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
    semesterId,
    lecturerId,
  } = req.body;

  let semester = await Semesters.findById(semesterId);
  if (!semester) return res.status(400).send("Semester not found");

  const lecturer = await Users.findById(lecturerId);
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
    numOfStudents: 0,
    semester: {
      name: semester.name,
      symbol: semester.symbol,
      year: semester.year,
    },
    lecturer: {
      lecturerId: lecturer.userId,
      degree: lecturer.degree,
      name: lecturer.name,
      mail: lecturer.mail,
      degree: lecturer.degree,
    },
    lessons: generateLessons(numOfWeek),
  });

  await classes.save();
  res.send(classes);
});

router.get;

router.post(
  "/:id/addStudent",
  validate(validateStudentInClass),
  async (req, res) => {
    const { id } = req.params;
    const { mail } = req.body;

    let myClass = await Classes.findById(id);
    if (!myClass) return res.status(400).send("Given class id not found");

    let name = "";
    let studentId = "";

    const studentExist = myClass.lessons[0].students.find(
      (x) => x?.mail === mail
    );
    if (studentExist) return res.status(400).send("student was exist in class");

    const student = await Students.findOne({ mail });
    if (!student) {
      name = "Student not login yet";
      studentId = "Student not login yet";
    } else {
      name = student.name;
      studentId = student.studentId;
    }

    try {
      await new Fawn.Task()
        .update(
          "classes",
          { _id: myClass?._id },
          {
            $push: {
              "lessons.$[].students": {
                mail,
                name,
                studentId,
                status: false,
              },
            },
            $inc: {
              numOfStudents: 1,
            },
          }
        )
        .update(
          "students",
          { mail },
          {
            $push: {
              classes: {
                _id: myClass._id,
                classTermId: myClass.classTermId,
                name: myClass.name,
              },
            },
          }
        )
        .run();

      myClass = await Classes.findById(id);
      res.send(myClass);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something failed");
    }
  }
);

router.put(
  "/:id/:orderLesson",
  [validateObjectId, validate(validateStudentInClass)],
  async (req, res) => {
    const { id, orderLesson } = req.params;
    const { mail, status } = req.body;

    if (!status) return res.status(400).send("Status is required");

    let myClass = await Classes.findById(id);
    if (!myClass) return res.status(400).send("Given input not found");

    const student = myClass.lessons[0].students.find((x) => x?.mail === mail);
    if (!student) return res.status(400).send("Not found Student in Class");

    myClass.lessons[orderLesson - 1].students.find(
      (x) => x.mail === mail
    ).status = status;

    res.send(myClass);
  }
);

router.put(
  "/:id",
  [validateObjectId, validate(validateClass)],
  async (req, res) => {
    const { semesterId, lecturerId } = req.body;

    const lecture = await Users.findOne({ _id: lecturerId });
    if (!lecture) return res.status(400).send("Invalid lecture Id");

    const semester = await Semesters.findOne({ _id: semesterId });
    if (!semester) return res.status(400).send("Invalid semester Id");

    const classes = await Classes.findByIdAndUpdate(
      req.params.id,
      {
        ..._.pick(req.body, [
          "classTermId",
          "name",
          "numOfCredits",
          "courseType",
          "schoolYear",
          "startData",
          "endDate",
          "room",
          "dayOfWeek",
          "numOfWeek",
        ]),
        semester: {
          year: semester.year,
          name: semester.name,
          symbol: semester.symbol,
        },
        lecturer: {
          lecturerId: lecture.userId,
          name: lecture.name,
          mail: lecture.mail,
          degree: lecture.degree,
        },
      },
      { new: true }
    );

    res.send(classes);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const classes = await Classes.findByIdAndDelete(req.params.id);

  if (!classes)
    return res.status(404).send("The Semester with the given ID was not found");

  res.send("Delete Successfully");
});

async function renderStudent(students) {
  const result = await students.map(async (x) => {
    const student = await Students.findOne({ mail: x?.mail });
    if (student)
      return {
        mail: student.mail,
        studentId: student.studentId,
        name: student.name,
      };

    return { mail: x?.mail, studentId: "Not login yet", name: "Not login yet" };
  });

  console.log(result);

  return result;
}

function generateLessons(numOfWeek) {
  let lessons = [];
  let num = numOfWeek;
  for (var i = 1; i <= num; i++) {
    lessons.push({
      order: i,
      name: `Lesson ${i}`,
      students: [],
      numOfAttendance: 0,
      numOfNonAttendance: 0,
      codeAttendance: 2,
      expiredCode: 0,
      status: false,
    });
  }

  return lessons;
}

module.exports = router;
