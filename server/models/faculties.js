const mongoose = require("mongoose");

const schemaFaculty = new mongoose.Schema({
  name: { type: String, required: true },
  majorName: { type: String, required: true },
});

const Faculties = mongoose.model("faculties", schemaFaculty);

exports.schemaFaculty = schemaFaculty;
exports.Faculties = Faculties;
