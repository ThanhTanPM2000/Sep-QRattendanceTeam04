const express = require("express");
require("dotenv").config();
const config = require("config");

const app = express();
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: ["http://localhost:3000"],
  },
});

app.set("socketio", io);

require("./startup/logging")();
require("./startup/prod")(app);
require("./startup/validation")();
require("./startup/db")();
require("./startup/routes")(app);

const port = process.env.PORT || 3900;

io.on("connection", (socket) => {
  console.log("hello ", socket.id);
});

const server = httpServer.listen(port, () => {
  console.log(`Listening on Port ${port}...`);
});

module.exports = server;
