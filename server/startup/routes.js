const express = require("express");

const users = require("../routes/users");
const semesters = require("../routes/semesters");
const classes = require("../routes/classes");
const faculties = require("../routes/faculties");
const error = require("../middleware/error");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/users", users);
  app.use("/api/semesters", semesters);
  app.use("/api/classes", classes);
  app.use("/api/faculties", faculties);
  app.use(error);
};
