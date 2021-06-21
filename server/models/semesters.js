const mongoose = require("mongoose");
const Joi = require("joi");

const schemaSemester = new mongoose.Schema({
  name: { type: String, required: true },
  year: { type: String, required: true },
  symbol: { type: String, required: true, index: true },
});

const Semesters = mongoose.model("Semesters", schemaSemester);

function validateSemester(reqBody) {
  const schema = Joi.object({
    name: Joi.string().required(),
    symbol: Joi.string().required(),
    year: Joi.string().required(),
  });

  return schema.validate(reqBody);
}

exports.schemaSemester = schemaSemester;
exports.validateSemester = validateSemester;
exports.Semesters = Semesters;
