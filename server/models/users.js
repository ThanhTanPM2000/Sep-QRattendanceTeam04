const config = require("config");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const { schemaFaculty } = require("./faculties");
const { schemaRole } = require("./roles");

const schemaUser = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  degree: { type: String, required: true },
  faculty: { type: schemaFaculty, required: true },
  role: { type: schemaRole, required: true },
  classes: [String],
});

schemaUser.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      mail: this.mail,
      name: this.name,
      role: this.role.name,
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

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

exports.Users = Users;
exports.validateUser = validateUser;
