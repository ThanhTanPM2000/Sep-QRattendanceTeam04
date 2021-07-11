const mongoose = require("mongoose");
const Joi = require("joi").extend(require("@joi/date"));

const { schemaSemester } = require("./semesters");

const studentInClassSchema = new mongoose.Schema(
  {
    mail: { type: String, index: true },
    name: String,
    studentId: String,
    status: String,
  },
  { _id: false }
);

const schemaClass = new mongoose.Schema({
  classTermId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  numOfCredits: { type: Number, required: true },
  courseType: { type: String, required: true },
  schoolYear: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  room: { type: String, required: true },
  dayOfWeek: { type: Number, required: true },
  numOfWeek: { type: Number, required: true },
  session: { type: String, required: true },
  numOfStudents: Number,
  semester: { type: schemaSemester, required: true },
  lecturer: {
    type: new mongoose.Schema(
      {
        lecturerId: {
          type: String,
        },
        name: {
          type: String,
        },
        mail: {
          type: String,
          required: true,
        },
        degree: {
          type: String,
        },
      },
      { _id: false }
    ),
  },
  lessons: [
    {
      type: new mongoose.Schema(
        {
          order: Number,
          name: String,
          students: [studentInClassSchema],
          numOfAttendance: Number,
          numOfNonAttendance: Number,
          codeAttendance: String,
          expiredTime: Number,
          qrCode: String,
          status: String,
        },
        { _id: false }
      ),
    },
  ],
});

const Classes = mongoose.model("Classes", schemaClass);

function validateClass(reqBody) {
  const schema = Joi.object({
    classTermId: Joi.string().required(),
    name: Joi.string().required(),
    numOfCredits: Joi.number().required(),
    courseType: Joi.string().min(2).max(2).required(),
    schoolYear: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    room: Joi.string().required(),
    dayOfWeek: Joi.number().min(2).max(8).required(),
    numOfWeek: Joi.number().required(),
    session: Joi.string().required(),
    semesterId: Joi.string().required(),
    lecturerMail: Joi.string().email().required(),
  });

  return schema.validate(reqBody);
}

function validateStudentInClass(reqBody) {
  const schema = Joi.object({
    mail: Joi.string().required(),
    name: Joi.string(),
    studentId: Joi.string(),
    status: Joi.boolean(),
  });

  return schema.validate(reqBody);
}

exports.validateClass = validateClass;
exports.validateStudentInClass = validateStudentInClass;
exports.Classes = Classes;
