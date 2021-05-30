const express = require("express");
const mongoose = require("mongoose");

const students = require("./routes/students");
const sessions = require("./routes/sessions");
const lectures = require("./routes/lectures");
const classes = require("./routes/classes");

const app = express();

mongoose
  .connect("mongodb://localhost/qrcode", { useUnifiedTopology: true })
  .then(console.log("ket noi toi database thanh cong"))
  .catch((err) => {
    console.log("fail roi ban oi", err);
  });

// promise
// async await

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api/students", students);
app.use("/api/sessions", sessions);
app.use("/api/lectures", lectures);
app.use("/api/classes", classes);

app.listen(3000, () => {
  console.log("App listening on port 3000");
});
