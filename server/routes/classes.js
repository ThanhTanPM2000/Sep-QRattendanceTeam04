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
    lecturerMail,
  } = req.body;

  let myClass = await Classes.findOne({ classTermId });
  if (myClass) return res.status(400).send("Class Term Id was exist");

  let semester = await Semesters.findOne({ symbol: semesterId });
  if (!semester) return res.status(400).send("Semester not found");

  let lecturer = await Users.findOne({ mail: lecturerMail });
  if (!lecturer) {
    lecturer = {
      name: "waiting lecturer registered...",
      userId: "waiting lecturer registered",
      mail: lecturerMail,
      degree: "lecturer",
    };
  }

  myClass = new Classes({
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
      name: lecturer.name,
      mail: lecturer.mail,
      degree: lecturer.degree,
    },
    lessons: generateLessons(numOfWeek),
  });

  try {
    const task = new Fawn.Task();
    task.save("classes", myClass);
    task.update(
      "users",
      { mail: lecturer.mail },
      {
        $push: { classes: myClass._id },
      }
    );
    await task.run({ useMongoose: true });
    res.send(myClass);
  } catch (error) {
    res.status(500).send("Something failed on server");
  }
});

router.post(
  "/:id/addStudent",
  validate(validateStudentInClass),
  async (req, res) => {
    const { id } = req.params;
    const { mail } = req.body;

    let myClass = await Classes.findById(id);
    if (!myClass) return res.status(400).send("Given class id not found");

    const studentExist = myClass.lessons[0].students.find(
      (x) => x?.mail === mail
    );
    if (studentExist) return res.status(400).send("student was exist in class");

    const student = await Students.findOne({ mail });
    if (!student) {
      student = {
        name: "Student not login yet",
        studentId: "Student not login yet",
      };
    }

    myClass.lessons.forEach((x) => {
      x.students.push({
        mail,
        name: student["name"],
        studentId: student["studentId"],
        status: false,
      });
    });
    myClass.numOfStudents++;

    try {
      const task = new Fawn.Task();
      task.update(
        "classes",
        { _id: myClass?._id },
        {
          $set: {
            lessons: myClass.lessons,
          },
        }
      );
      task.update(
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
      );
      await task.run();
      res.send(myClass);
    } catch (error) {
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
    if (!student) return res.status(400).send("Student not found in Class");

    myClass.lessons[orderLesson - 1].students.find(
      (x) => x.mail === mail
    ).status = status;
    await myClass.save();

    res.send(myClass);
  }
);

router.put(
  "/:id",
  [validateObjectId, validate(validateClass)],
  async (req, res) => {
    const { id } = req.params;
    const {
      classTermId,
      name,
      numOfCredits,
      courseType,
      schoolYear,
      startDate,
      endDate,
      room,
      numOfWeek,
      dayOfWeek,
      session,
      semesterId,
      lectureMail,
    } = req.body;

    let myClass = await Classes.findById(id);
    if (!myClass) return res.status(400).send("Invalid class id");

    const lecturer = await Users.findOne({ mail: lectureMail });
    if (!lecturer) {
      lecturer["name"] = "waiting lecturer registered...";
      lecturer["lecturerId"] = "waiting lecturer registered";
      lecturer["mail"] = lecturerMail;
      lecturer["degree"] = "lecturer";
    }

    const semester = await Semesters.findOne({ _id: semesterId });
    if (!semester) return res.status(400).send("Invalid semester Id");

    // myClass.classTermId = classTermId;
    // myClass.name = name;
    // myClass.numOfCredits = numOfCredits;
    // myClass.courseType = courseType;
    // myClass.schoolYear = schoolYear;
    // myClass.startDate = startDate;
    // myClass.endDate = endDate;
    // myClass.room = room;
    // myClass.numOfWeek = numOfWeek;
    // myClass.dayOfWeek = dayOfWeek;
    // myClass.session = session;
    // myClass.semesterId = semester;
    // myClass.lecturer = lecturer;

    try {
      const task = new Fawn.Task();

      task.update(
        "classes",
        { _id: myClass._id },
        {
          $set: {
            classTermId,
            name,
            numOfCredits,
            courseType,
            schoolYear,
            startDate,
            endDate,
            room,
            numOfWeek,
            dayOfWeek,
            session,
            lecturer,
            semester,
          },
        }
      );
      if (myClass.lecturer.mail !== lecturerMail) {
        task.update(
          "users",
          { mail: myClass.lecturer.mail },
          {
            $pull: { classes: myClass._id },
          }
        );
      }
      task.update(
        "users",
        { mail: lecturerMail },
        {
          $push: { classes: myClass._id },
        }
      );

      await task
        .run({ useMongoose: true })
        .then((result) => console.log(result[0]));

      myClass = await Classes.findById(id);
      res.send(myClass);
    } catch (error) {
      res.status(500).send("Something failed on server");
    }
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
