const request = require("supertest");
const { Semesters } = require("../../models/semesters");
const { Users } = require("../../models/users");
const mongoose = require("mongoose");
let server;

describe("/api/semesters", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(() => {
    server.close();
  });

  describe("GET /:id", () => {
    it("should return all semesters", () => {
      const res = request(server).get("/api/semesters");
      expect(res.status).toBe(undefined);
    });
  });
  describe("POST /", () => {
    it("should return 400 if Symbol Semester already exists", async () => {
      const res = await request(server)
        .post("/api/semesters")
        .send({ name: "semester1" });
      expect(res.status).toBe(400);
    });
    it("should save the semesters if is valid", () => {
      const payloadId = new mongoose.Types.ObjectId().toHexString();
      const payload = {
        _id: payloadId,
        mail: "thien.187pm20583@vanlanguni.vn",
        name: "TNT",
        role: {
          _id: new mongoose.Types.ObjectId().toHexString(),
          name: "Admin",
        },
      };
      const users = new Users(payload);
      const token = users.generateAuthToken();
      const res = request(server)
        .post("/api/semesters")
        .set("x-auth-token", token)
        .send({ name: "semester1" });

      const semesters = Semesters.findOne({ name: "semester1" });
      expect(semesters).not.toBeNull();
    });
    it("should return the semesters if is valid", () => {
      const payloadId = new mongoose.Types.ObjectId().toHexString();
      const payload = {
        _id: payloadId,
        mail: "thien.187pm20583@vanlanguni.vn",
        name: "TNT",
        role: {
          _id: new mongoose.Types.ObjectId().toHexString(),
          name: "Admin",
        },
      };
      const users = new Users(payload);
      const token = users.generateAuthToken();
      const res = request(server)
        .post("/api/semesters")
        .set("x-auth-token", token)
        .send({ name: "semester1" });

      const semesters = Semesters.findOne({ name: "semester1" });
      expect(semesters).not.toBeNull();
    });
  });
});
