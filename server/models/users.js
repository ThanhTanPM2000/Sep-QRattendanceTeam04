const mongoose = require("mongoose");
const Joi = require("joi");

const schemaUser = new mongoose.Schema({
  id: { type: String, required: true },
  displayName: { type: String, required: true },
  mail: { type: String, required: true },
  degree: { type: String, required: true },
  faculty: { type: String, required: true },
  role: { type: String, required: true },
});

const Users = mongoose.model("Users", schemaUser);

function validateUser(reqBodyUser) {
  const schema = Joi.object({
    id: Joi.string().required(),
    displayName: Joi.string().required(),
    mail: Joi.string().email().required(),
    degree: Joi.string().required(),
    faculty: Joi.string().required(),
    role: Joi.string().required(),
  });

  return schema.validate(reqBodyUser);
}

exports.validateUser = validateUser;
exports.Users = Users;
