import express from "express";

module.exports = function (app) {
  app.use(express.json());
};
