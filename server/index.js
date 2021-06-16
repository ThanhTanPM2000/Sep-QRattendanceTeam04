const express = require("express");

const app = express();

require("./startup/logging")();
require("./startup/prod")(app);
require("./startup/db")();
require("./startup/routes")(app);

const server = app.listen(3000, () => {
  console.log(`Listening on Port ${3000}...`);
});

module.exports = server;
