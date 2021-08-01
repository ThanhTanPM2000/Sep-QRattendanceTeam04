const express = require("express");
const moment = require("moment");
const _ = require("lodash");
const mongoose = require("mongoose");
const { Semesters } = require("../models/semesters");
const Fawn = require("../utils/transaction");
const Joi = require("joi");

const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Classes } = require("../models/classes");

const router = express.Router();

router.get("/:id", async (req, res) => {
  let myClass = await Classes.findById(req.params.id);
  if (myClass) return res.status(400).send("Id class not exist in system");

  res.send(myClass.lesson);
});

router.get("/:id/order", async (req, res) => {
  const order = req.params.order;

  let myClass = await Classes.findById(id);
  if (!myClass) return res.status(400).send("Id class not exist in system");

  if (isNaN(order) || order < 1 || order > myClass.lessons.length) {
    return res.status(400).send("Invalid order");
  }

  res.send(myClass.lesson[order - 1]);
});

router.post(
  "/:id/:order",
  [validateObjectId, validate(validateLesson)],
  async (req, res) => {
    const { expiredTime, qrCode } = req.body;
    const { id, order } = req.params;

    let myClass = await Classes.findById(id);
    if (!myClass) return res.status(400).send("Id class not exist in system");

    if (isNaN(order) || order < 1 || order > myClass.lessons.length) {
      return res.status(400).send("Invalid order");
    }
    myClass.lessons[order - 1].expiredTime = expiredTime;
    myClass.lessons[order - 1].qrCode = qrCode;
    myClass.lessons[order - 1].status = "Activated";

    myClass.save();
    res.send(myClass);
  }
);

router.put("/:id/:order", validate(validateAttendance), async (req, res) => {
  const { mail } = req.body;
  const { id, order } = req.params;

  let myClass = await Classes.findById(id);
  if (!myClass) return res.status(400).send("Id class not exist in system");

  if (isNaN(order) || order < 1 || order > myClass.lessons.length) {
    return res.status(400).send("Invalid order");
  }

  const result = myClass.lessons[order - 1].students.find((x) => {
    if (x.mail === mail) {
      const currentStatus = new Date(x.status);
      if (currentStatus == "Invalid Date") {
        myClass.lessons[order - 1].numOfAttendance++;
        myClass.lessons[order - 1].numOfNonAttendance--;
        myClass.sumOfAttendance++;
        myClass.sumOfNonAttendance--;

        x.status = moment().format("DD/MM/YYYY HH:mm");
      } else {
        myClass.lessons[order - 1].numOfAttendance--;
        myClass.lessons[order - 1].numOfNonAttendance++;
        myClass.sumOfAttendance--;
        myClass.sumOfNonAttendance++;
        x.status = "Not Attended";
      }
      return x;
    }
  });

  if (!result) return res.status(404).send("Not find student in Class");

  try {
    const task = new Fawn.Task();
    task.update("classes", { _id: myClass._id }, { $set: myClass });
    task.update(
      "students",
      { mail },
      {
        $push: {
          history: {
            _id: mongoose.Types.ObjectId(),
            time: new Date(),
            title: "Attended Successfully",
            description: `You Attended successfully class ${myClass.name} - ${myClass.classTermId} - lesson ${order}`,
          },
        },
      }
    );
    await task.run({ useMongoose: true });
    res.send(myClass);
  } catch (error) {
    res.status(500).send("Something failed with server");
  }
});

router.put("/reset/:id/:order", (req, res) => {});

router.put(
  "/:id/:order/students",
  validate(validateAttendance),
  async (req, res) => {
    const { mail, deviceId } = req.body;
    const { id, order } = req.params;

    let myClass = await Classes.findById(id);
    if (!myClass) return res.status(400).send("Id class not exist in system");

    if (isNaN(order) || order < 1 || order > myClass.lessons.length) {
      return res.status(400).send("Invalid order");
    }

    const expiredTime = myClass.lessons[order - 1].expiredTime;

    const qrCode = myClass.lessons[order - 1].qrCode;

    const timeSet = _.split(qrCode, "_", 3);

    const diff = new Date() - new Date(timeSet[2]);

    if (new Date(diff).getMinutes() >= expiredTime) {
      return res.status(403).send("Expired Lesson");
    }

    const result = myClass.lessons[order - 1].students.find((x) => {
      if (x.mail === mail) {
        const currentStatus = new Date(x.status);
        if (currentStatus == "Invalid Date") {
          if (myClass.lessons[order - 1].devicesId.includes(deviceId)) {
            return res
              .status(400)
              .send("This device was already attended for another account");
          }

          myClass.lessons[order - 1].numOfAttendance++;
          myClass.lessons[order - 1].numOfNonAttendance--;
          myClass.sumOfAttendance++;
          myClass.sumOfNonAttendance--;

          myClass.lessons[order - 1].averageOfAttendance =
            myClass.lessons.reduce((reducer, currentValue) => {
              return reducer + currentValue.numOfAttendance;
            }, 0) / myClass.numOfStudents;

          myClass.lessons[order - 1].averageOfAttendance =
            myClass.lessons.reduce((reducer, currentValue) => {
              return reducer + currentValue.numOfNonAttendance;
            }, 0) / myClass.numOfStudents;

          myClass.averageOfAttendance =
            myClass.lessons.reduce((reducer, currentValue) => {
              return reducer + currentValue.averageOfAttendance;
            }, 0) / myClass.lessons.length;

          myClass.averageOfNonAttendance =
            myClass.lessons.reduce((reducer, currentValue) => {
              return reducer + currentValue.averageOfNonAttendance;
            }, 0) / myClass.lessons.length;

          const date = new Date();
          x.status = `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
          x.deviceId = deviceId;
          myClass.lessons[order - 1].devicesId.push(deviceId);
        } else {
          return res.status(400).send("You already attended in this lesson");
        }
        return x;
      }
    });

    if (!result) return res.status(404).send("Not find student in Class");

    try {
      const task = new Fawn.Task();
      task.update("classes", { _id: myClass._id }, { $set: myClass });
      task.update(
        "students",
        { mail },
        {
          $push: {
            history: {
              _id: mongoose.Types.ObjectId(),
              time: new Date(),
              title: "Attended Successfully",
              description: `You Attended successfully class ${myClass.name} - ${myClass.classTermId} - lesson ${order}`,
            },
          },
        }
      );
      await task.run({ useMongoose: true });
      res.send(myClass);
    } catch (error) {
      res.status(500).send("Something failed");
    }
  }
);

function validateLesson(req) {
  const schema = Joi.object({
    expiredTime: Joi.number().required(),
    qrCode: Joi.string().required(),
  });
  return schema.validate(req);
}

function validateAttendance(req) {
  const schema = Joi.object({
    mail: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    deviceId: Joi.string(),
  });
  return schema.validate(req);
}

module.exports = router;
