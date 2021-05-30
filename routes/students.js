const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Student = require("../models/students");

router.get("/", async (req, res, next) => {
  const students = await Student.find();
  res.send(students);
});

router.get("/:id", async (req, res, next) => {
  const student = await Student.findById(req.params.id);
  res.send(student);
});

// req = request res = response
router.post("/", (req, res, next) => {
  // const name = req.body.name;
  // const mssv = req.body.mssv;
  // const khoa = req.body.khoa;

  const { name, mssv, khoa } = req.body;

  const student = new Student({
    // name: name
    name,
    mssv,
    khoa,
  });
  student.save();
  res.send(student);
});

// user name = "Nguyen thanh tan" mssv="187pm20569k" khoa="cntt"

router.put("/:id", async (req, res, next) => {
  const id = req.params.id;
  // const student = await Student.findById(id);
  const { name, mssv, khoa } = req.body;

  const student = await Student.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        mssv,
        khoa,
      },
    },
    { new: true }
  );

  student.save();
  res.send(student);
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;
  const student = await Student.findById(id);
  student.remove();
  res.send("du lieu da xoa thanh cong");
});

module.exports = router;
