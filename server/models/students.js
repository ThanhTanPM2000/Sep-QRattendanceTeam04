const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

const historySchema = new mongoose.Schema(
  {
    time: Date,
    title: String,
    description: String,
  },
  { index: true }
);

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  classes: [
    {
      type: new mongoose.Schema({
        classTermId: {
          type: String,
        },
        name: String,
        lecturer: {
          type: new mongoose.Schema({
            lecturerId: {
              type: String,
            },
            name: {
              type: String,
            },
            mail: {
              type: String,
              required: true,
              index: true,
            },
            degree: {
              type: String,
            },
          }),
        },
      }),
    },
  ],
  history: [historySchema],
  isSeenHistory: Boolean,
});

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      mail: this.mail,
      name: this.name,
      studentId: this.studentId,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const Students = mongoose.model("Students", studentSchema);

function validateStudent(reqBody) {
  const schema = Joi.object({
    mail: Joi.string().required(),
    studentId: Joi.string(),
    name: Joi.string(),
  });

  return schema.validate(reqBody);
}

exports.Students = Students;
exports.validateStudent = validateStudent;
