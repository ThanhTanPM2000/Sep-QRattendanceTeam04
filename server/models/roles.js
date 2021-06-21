const mongoose = require("mongoose");

const schemaRole = new mongoose.Schema({
  name: { type: String, required: true },
});

const Roles = mongoose.model("Roles", schemaRole);

exports.schemaRole = schemaRole;
exports.Roles = Roles;
