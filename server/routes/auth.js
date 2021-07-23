const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");

const { Users } = require("../models/users");
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

function validateAuth(req) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(255).required(),
    mail: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(req);
}

module.exports = router;
