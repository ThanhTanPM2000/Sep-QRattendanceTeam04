const express = require("express");
const config = require("config");

const app = express();

require("./startup/logging")();
require("./startup/prod")(app);
require("./startup/validation")();
require("./startup/db")();
require("./startup/routes")(app);

const port = config.get("port");
const server = app.listen(port, () => {
  console.log(`Listening on Port ${port}...`);
});

module.exports = server;
