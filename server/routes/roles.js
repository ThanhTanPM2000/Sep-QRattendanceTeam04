const express = require("express");

const { Roles } = require("../models/roles");
const validationObjectId = require("../middleware/validateObjectId");
const router = express.Router();

router.get("/", async (req, res) => {
  const roles = await Roles.find();
  res.send(roles);
});

router.get("/:id", validationObjectId, async (req, res) => {
  let role = await Roles.findById(req.params.id);
  if (!role) return res.status(404).send("Role not found");
  res.send(role);
});

module.exports = router;
