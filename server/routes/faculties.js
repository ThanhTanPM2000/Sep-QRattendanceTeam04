const express = require("express");

const { Faculties } = require("../models/faculties");
const validationObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.get("/", async (req, res) => {
  const faculties = await Faculties.find();
  res.send(faculties);
});

router.get("/:id", validationObjectId, async (req, res) => {
  let faculty = await Faculties.findById(req.params.id);
  if (!faculty) return res.status(404).send("Faculty not found");
  res.send(faculty);
});

module.exports = router;
