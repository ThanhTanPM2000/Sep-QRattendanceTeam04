const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");

const { Users } = require("../models/users");
const { Students } = require("../models/students");
const validate = require("../middleware/validate");

const router = express.Router();

router.post("/", validate(validateAuth), async (req, res) => {
  let { mail, name } = req.body;
  name = _.replace(name, "\t", "");

  if (_.endsWith(mail, "@vanlanguni.vn")) {
    name = _.split(name, "-", 3)[1].trim();
    // return res.status(401).send("This account don't have permission to access");
  } else if (_.endsWith(mail, "@vlu.edu.vn")) {
    name = _.split(name, "-", 2)[0].trim();
  }

  let user = await Users.findOne({ mail: req.body.mail });
  if (!user) {
    const token = jwt.sign(
      {
        mail,
        name,
        role: "lecturer",
      },
      config.get("jwtPrivateKey")
    );
    return res.send(token);
  }

  const token = user.generateAuthToken();
  res.send(token);
});

router.post("/student", validate(validateAuth), async (req, res) => {
  let { mail, name, studentId } = req.body;

  if (!_.endsWith(mail, "@vanlanguni.vn")) {
    return res.status(400).send("Account cant login in this app");
  }

  let student = await Students.findOne({ mail });
  if (!student) {
    const token = jwt.sign(
      {
        mail,
        name,
        studentId,
      },
      config.get("jwtPrivateKey")
    );
    return res.send(token);
  }

  const token = student.generateAuthToken();
  res.send(token);
});

function validateAuth(req) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    mail: Joi.string().min(5).max(255).required().email(),
    studentId: Joi.string(),
  });

  return schema.validate(req);
}

module.exports = router;
