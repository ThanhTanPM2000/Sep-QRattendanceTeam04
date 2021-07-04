const mongoose = require("mongoose");
const Joi = require("joi").extend(require("@joi/date"));

const { schemaSemester } = require("./semesters");

const studentInClassSchema = new mongoose.Schema(
  {
    mail: { type: String, index: true },
    name: String,
    studentId: String,
    status: Boolean,
  },
  { _id: false }
);

const schemaClass = new mongoose.Schema({
  classTermId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  numOfCredits: { type: Number, required: true },
  courseType: { type: String, required: true },
  schoolYear: { type: String, required: true },
  startDate: { type: String },
  endDate: { type: String },
  room: { type: String, required: true },
  dayOfWeek: { type: String, required: true },
  numOfWeek: { type: Number, required: true },
  numOfStudents: Number,
  semester: { type: schemaSemester, required: true },
  lecturer: {
    type: new mongoose.Schema({
      lecturerId: {
        type: String,
        required: true,
        trim: true,
      },
      name: {
        type: String,
        required: true,
      },
      mail: {
        type: String,
        required: true,
      },
      degree: {
        type: String,
        required: true,
      },
    }),
  },
  lessons: [
    {
      order: Number,
      name: String,
      students: [studentInClassSchema],
      numOfAttendance: Number,
      numOfNonAttendance: Number,
      codeAttendance: String,
      expiredCode: Number,
      status: Boolean,
    },
  ],
});

const Classes = mongoose.model("Classes", schemaClass);

function validateClass(reqBody) {
  const schema = Joi.object({
    classTermId: Joi.string().required(),
    name: Joi.string().required(),
    numOfCredits: Joi.number().required(),
    courseType: Joi.string().required(),
    schoolYear: Joi.string().required(),
    startDate: Joi.date().iso().utc(),
    endDate: Joi.date().iso().utc(),
    room: Joi.string().required(),
    dayOfWeek: Joi.string().required(),
    numOfWeek: Joi.number().required(),
    semesterId: Joi.string().required(),
    lecturerId: Joi.string().required(),
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
