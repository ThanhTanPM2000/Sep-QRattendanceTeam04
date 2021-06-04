import winston from "winston";
import mongoose from "mongoose";
import config from "config";

module.exports = function () {
  const db = config.get("db");
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => winston.info(`Connected to ${db}...`));
};
