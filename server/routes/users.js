const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const { Users, validateUser } = require("../models/users");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Faculties } = require("../models/faculties");
const { Roles } = require("../models/roles");

const router = express.Router();

router.get("/", async (req, res) => {
  const users = await Users.find();
  res.send(users);
});

router.get("/:id", async (req, res) => {
  const users = await Users.findById(req.params.id);
  if (!users) return res.status(404).send("User not found");
  res.send(users);
});

router.post("/", validate(validateUser), async (req, res, next) => {
  let user = await Users.findOne({ mail: req.body.mail });
  if (user) return res.status(400).send("User already registered");

  user = await Users.findOne({ userId: req.body.userId });
  if (user) return res.status(400).send("User Id was exist");

  if (!mongoose.Types.ObjectId.isValid(req.body.facultyId)) {
    return res.status(404).send("Invalid Id");
  }
  const faculty = await Faculties.findById(req.body.facultyId);
  if (!faculty) return res.status(400).send("Faculty not found");

  if (!mongoose.Types.ObjectId.isValid(req.body.roleId)) {
    return res.status(404).send("Invalid Id");
  }
  const role = await Roles.findById(req.body.roleId);
  if (!role) return res.status(400).send("Role not found");

  user = new Users({
    ..._.pick(req.body, ["userId", "name", "mail", "degree"]),
    faculty: {
      _id: faculty._id,
      name: faculty.name,
      majorName: faculty.majorName,
    },
    role: {
      _id: role._id,
      name: role.name,
    },
  });

  await user.save();

  const token = user.generateAuthToken();
  res.header("x-auth-token", token).send(user);
});

router.put(
  "/:id",
  [validateObjectId, validate(validateUser)],
  async (req, res) => {
    const faculty = await Faculties.findById(req.body.facultyId);
    if (!faculty) return res.status(400).send("Invalid Id faculty");

    const role = await Roles.findById(req.body.roleId);
    if (!role) return res.status(400).send("Invalid Id role");

    const user = await Users.findByIdAndUpdate(
      req.params.id,
      {
        ..._.pick(req.body, ["userId", "name", "mail", "degree"]),
        faculty,
        role,
      },
      { new: true }
    );

    if (!user)
      return res.status(404).send("The User with the given ID was not found");

    res.send(user);
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const user = await Users.findByIdAndDelete(req.params.id);

  if (!user)
    return res.status(404).send("The User with the given ID was not found");

  res.send("Delete Successfully");
});

module.exports = router;
