const mongoose = require("mongoose");

const schemaStudent = new mongoose.Schema({
  mssv: String,
  name: String,
  khoa: String,
});

const Student = mongoose.model("Students", schemaStudent);

module.exports = Student;
