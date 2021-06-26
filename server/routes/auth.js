const Joi = require("joi");
const _ = require("lodash");
const { Users } = require("../models/users");
const mongoose = require("mongoose");
const express = require("express");
const validate = require("../middleware/validate");
const router = express.Router();

router.post("/", validate(validateAuth), async (req, res) => {
  let user = await Users.findOne({ mail: req.body.email });
  if (!user) return res.send("register");

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
