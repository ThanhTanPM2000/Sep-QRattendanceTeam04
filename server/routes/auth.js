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
  let user = await Users.findOne({ mail: req.body.mail });
  if (!user) {
    const token = jwt.sign(
      {
        email: req.body.mail,
        name: req.body.name,
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
