const express = require("express");
const { Users, validateUser } = require("../models/users");
const validate = require("../middleware/validate");
const _ = require("lodash");
const validateObjectId = require("../middleware/validateObjectId");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

router.post("/", validate(validateUser), async (req, res, next) => {
  let user = await Users.findOne({ mail: req.body.mail });
  if (user) return res.status(400).send("User already registered");

  user = new Users(
    _.pick(req.body, ["id", "displayName", "mail", "degree", "faculty", "role"])
  );

  await user.save();
  res.send(_.pick(user, ["_id", "displayName", "email"]));
});

router.put(
  "/:id",
  [validateObjectId, validate(validateUser)],
  async (req, res) => {
    const user = await Users.findByIdAndUpdate(
      req.params.id,
      _.pick(req.body, [
        "id",
        "displayName",
        "mail",
        "degree",
        "faculty",
        "role",
      ]),
      { new: true }
    );

    if (!user)
      return res.status(404).send("The User with the given ID was not found");

    res.send(user);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const user = await Users.findById(req.params.id);

  if (!user)
    return res.status(404).send("The User with the given ID was not found");

  const result = await Users.remove(user);
  res.send(result);
});

module.exports = router;
