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
    session,
    room,
    dayOfWeek,
    numOfWeek,
    semesterId,
    lecturerMail,
  } = req.body;

  let myClass = await Classes.findOne({ classTermId });
  if (myClass) return res.status(400).send("Class Term Id was exist");

  let semester;
  if (mongoose.Types.ObjectId.isValid(semesterId)) {
    semester = await Semesters.findById(semesterId);
  } else {
    semester = await Semesters.findOne({ symbol: semesterId });
  }
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
    session,
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

router.post("/:id", validate(validateStudentInClass), async (req, res) => {
  const { id } = req.params;
  const { mail } = req.body;

  let myClass = await Classes.findById(id);
  if (!myClass) return res.status(400).send("Given class id not found");

  const studentExist = myClass.lessons[0].students.find(
    (x) => x?.mail === mail
  );
  if (studentExist) return res.status(400).send("student was exist in class");

  let student = await Students.findOne({ mail });
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
      status: "Not Attendance",
    });
    x.numOfNonAttendance++;
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
        $inc: {
          numOfStudents: 1,
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
    await task.run({ useMongoose: true });
    res.send(myClass);
  } catch (error) {
    res.status(500).send("Something failed");
  }
});

router.put(
  "/:id/:mail",
  [validateObjectId, validate(validateStudentInClass)],
  async (req, res) => {
    const { id, mail } = req.params;
    const { status } = req.body;

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

router.delete("/:id/:mail", async (req, res) => {
  const { id, mail } = req.params;

  let myClass = await Classes.findById(id);
  if (!myClass) return res.status(400).send("Given input not found");

  const student = myClass.lessons[0].students.find((x) => x?.mail === mail);
  if (!student) return res.status(400).send("Student not found in Class");

  try {
    const task = new Fawn.Task();
    task.update(
      "classes",
      { _id: myClass._id },
      {
        $pull: {
          "lessons.$[].students": {
            mail: student.mail,
          },
        },
        $inc: {
          "lessons.$[].numOfNonAttendance": -1,
          numOfStudents: -1,
        },
      }
    );
    task.update(
      "students",
      { mail },
      {
        $pull: {
          classes: {
            $elemMatch: {
              classTermId: myClass.classTermId,
            },
          },
        },
      },
      { multi: true }
    );
    await task.run({ useMongoose: true });

    const newdata = await Classes.findById(id);
    res.send(newdata);
  } catch (error) {
    res.status(500).send("Something failed on server");
  }
});

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
      lecturerMail,
    } = req.body;

    let myClass = await Classes.findById(id);
    if (!myClass) return res.status(400).send("Invalid class id");

    let lecturer = await Users.findOne({ mail: lecturerMail });
    if (!lecturer) {
      lecturer = {
        name: "waiting lecturer registered",
        lecturerId: "waiting lecturer registered",
        mail: lecturerMail,
        degree: "waiting lecturer registered",
      };
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

      await task.run({ useMongoose: true });

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

router.put("/:id");

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
      expiredTime: null,
      qrCode: null,
      status: "Availability",
    });
  }

  return lessons;
}

module.exports = router;
