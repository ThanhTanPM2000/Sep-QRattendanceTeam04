const request = require("supertest");
const { Roles } = require("../../models/roles");
const { result } = require("lodash");
const mongoose = require("mongoose");

let server;

describe("GET/:id", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    // await server.close();
  });

  it("should return 404 if invalid id is passed", async () => {
    const res = await request(server).get("/api/roles/1");
    expect(res.status).toBe(404);
  });
});
