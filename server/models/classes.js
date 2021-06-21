const mongoose = require("mongoose");
const Joi = require("joi");

const { schemaSemester } = require("./semesters");

const schemaClass = new mongoose.Schema({
  classTermId: { type: String, required: true },
  name: { type: String, required: true },
  numOfCredits: { type: Number, required: true },
  courseType: { type: String, required: true },
  schoolYear: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  room: { type: String, required: true },
  dayOfWeek: { type: String, required: true },
  numOfWeek: { type: Number, required: true },
  semester: { type: schemaSemester, required: true },
  lecturer: {
    type: new mongoose.Schema({
      lecturerId: {
        type: String,
        required: true,
        trim: true,
      },
      degree: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    }),
  },
  lessons: [
    {
      order: Number,
      students: [String],
      numOfAttendance: Number,
      numOfNonAttendance: Number,
      codeAttendance: String,
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
    startDate: Joi.date(),
    endDate: Joi.date(),
    room: Joi.string().required(),
    dayOfWeek: Joi.string().required(),
    numOfWeek: Joi.number().required(),
    semesterSymbol: Joi.string().required(),
    lecturerMail: Joi.string().email().required(),
    // lessons: Joi.object({
    //   order: Joi.number,
    //   students: Joi.array().items(Joi.string()),
    //   numOfAttendance: Joi.string(),
    //   numOfNonAttendance: Joi.number(),
    //   codeAttendance: Joi.string(),
    // }),i
  });

  return schema.validate(reqBody);
}

exports.validateClass = validateClass;
exports.Classes = Classes;
