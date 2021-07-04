const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

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
      }),
    },
  ],
});

studentSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      mail: this.mail,
      name: this.name,
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
