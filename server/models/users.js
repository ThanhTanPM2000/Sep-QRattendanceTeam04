const mongoose = require("mongoose");
const Joi = require("joi");

const { schemaFaculty } = require("./faculties");
const { schemaRole } = require("./roles");

const schemaUser = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  mail: { type: String, required: true, index: true },
  degree: { type: String, required: true },
  faculty: { type: schemaFaculty, required: true },
  role: { type: schemaRole, required: true },
});

const Users = mongoose.model("Users", schemaUser);

function validateUser(reqBodyUser) {
  const schema = Joi.object({
    userId: Joi.string().required(),
    name: Joi.string().required(),
    mail: Joi.string().email().required(),
    degree: Joi.string().required(),
    facultyId: Joi.objectId().required(),
    roleId: Joi.objectId().required(),
  });

  return schema.validate(reqBodyUser);
}

exports.validateUser = validateUser;
exports.Users = Users;
