const express = require("express");
const mongoose = require("mongoose");
const Fawn = require("../utils/transaction");
const _ = require("lodash");

const { Users, validateUser } = require("../models/users");
const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");
const { Faculties } = require("../models/faculties");
const { Roles } = require("../models/roles");
const { Classes } = require("../models/classes");
const { x } = require("joi");

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
  const { mail, name, userId, degree, facultyId, roleId } = req.body;

  let user = await Users.findOne({ mail });
  if (user) return res.status(400).send("User already registered");

  user = await Users.findOne({ userId });
  if (user) return res.status(400).send("User Id was exist");

  if (!mongoose.Types.ObjectId.isValid(facultyId)) {
    return res.status(404).send("Invalid Id");
  }
  const faculty = await Faculties.findById(facultyId);
  if (!faculty) return res.status(400).send("Faculty not found");

  if (!mongoose.Types.ObjectId.isValid(roleId)) {
    return res.status(404).send("Invalid Id");
  }
  const role = await Roles.findById(roleId);
  if (!role) return res.status(400).send("Role not found");

  const classes = await Classes.find({ "lecturer.mail": mail });

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
    classes: classes?.map((x) => x._id),
  });

  try {
    let task = new Fawn.Task();
    task.save("users", user);
    classes?.forEach((x) => {
      task.update(
        "classes",
        { _id: x._id },
        {
          $set: {
            lecturer: {
              mail,
              lecturerId: userId,
              name,
              degree,
            },
          },
        }
      );
    });
    task.run().then(() => {
      const token = user.generateAuthToken();
      res.header("x-auth-token", token).send(user);
    });
  } catch (error) {
    res.status(500).send("Something failed on server");
  }
});

router.put(
  "/:id",
  [validateObjectId, validate(validateUser)],
  async (req, res) => {
    const { id } = req.params;
    const { userId, name, mail, degree, facultyId, roleId } = req.body;

    const faculty = await Faculties.findById(facultyId);
    if (!faculty) return res.status(400).send("Invalid Id faculty");

    const role = await Roles.findById(roleId);
    if (!role) return res.status(400).send("Invalid Id role");

    let user = await Users.findById(id);
    if (!user)
      return res.status(404).send("The User with the given ID was not found");

    try {
      const task = new Fawn.Task();
      task.update(
        "users",
        { _id: user._id },
        {
          $set: {
            userId,
            name,
            mail,
            degree,
            faculty,
            role,
          },
        }
      );
      task.update(
        "classes",
        { "lecturer.mail": mail },
        {
          $set: {
            lecturer: {
              lecturerId: userId,
              name,
              mail,
              degree,
            },
          },
        }
      );
      await task.run();

      user = await Users.findOne({ mail });
      console.log(user);
      res.send(user);
    } catch (error) {
      res.status(500).send("Something failed on server");
    }
  }
);

router.delete("/:id", validateObjectId, async (req, res) => {
  const { id } = req.params;

  const user = await Users.findById(id);
  if (!user)
    return res.status(404).send("The User with the given ID was not found");

  if (user.classes.length !== 0)
    return res
      .status(405)
      .send(
        "Somewhere still have this user, please delete that first then come back"
      );

  await Users.deleteOne({ _id: user._id });

  res.send("Delete Successfully");
});

module.exports = router;
