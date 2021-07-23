const express = require("express");
require("dotenv").config();
const config = require("config");

const app = express();

require("./startup/logging")();
require("./startup/prod")(app);
require("./startup/validation")();
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 3900;
const server = app.listen(port, () => {
  console.log(`Listening on Port ${port}...`);
});

module.exports = server;
