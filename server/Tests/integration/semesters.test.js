const { Semesters } = require("../../models/semesters");
const request = require("supertest");
const mongoose = require("mongoose");
const { Users } = require("../../models/users");
const { Roles } = require("../../models/roles");

let server;

describe("/api/semesters", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Semesters.remove();
    // await server.close();
  });

  describe("GET/", () => {
    it("should return all semester", async () => {
      await Semesters.collection.insertMany([
        { name: "hoc ky 4" },
        { name: "hoc ky 5" },
      ]);
      const res = await request(server).get("/api/semesters");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "hoc ky 4")).toBeTruthy();
    });
  });
  describe("GET/ :id", () => {
    it("should return a semester2", async () => {
      const semester = new Semesters({
        name: "hoc ky 4",
        symbol: "HK222",
        year: "2021-2022",
      });
      await semester.save();
      const res = await request(server).get(
        "/api/semesters/" + semester.semesterId
      );
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", semester.name);
    });
    it("should return 404 if valid id is passes", async () => {
      const res = await request(server).get("/api/semester/1");
      expect(res.status).toBe(404);
    });
    it("should return 200 if valid id is passes", async () => {
      const res = await request(server).get("/api/semesters/1");
      expect(res.status).toBe(200);
    });
  });
  describe("POST/", () => {
    it("should return 400 Symbol Semester already exists", async () => {
      const res = await request(server)
        .post("/api/semesters")
        .send({ symbol: "HK222" });

      expect(res.status).toBe(400);
    });
    it("should return 400 if name valid", async () => {
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
      const token = new Users(payload).generateAuthToken();

      const res = await request(server)
        .post("/api/semesters")
        .set("x-auth-token", token)
        .send({ name: "Hoc ky 2" });

      expect(res.status).toBe(400);
    });
    it("should return 400 if symbol valid", async () => {
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
      const token = new Users(payload).generateAuthToken();

      const res = await request(server)
        .post("/api/semesters")
        .set("x-auth-token", token)
        .send({ symbol: "HK222" });

      expect(res.status).toBe(400);
    });
    it("should return 400 if year valid", async () => {
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
      const token = new Users(payload).generateAuthToken();

      const res = await request(server)
        .post("/api/semesters")
        .set("x-auth-token", token)
        .send({ year: "2020" });

      expect(res.status).toBe(400);
    });
    it("should return the semester if it is valid", async () => {
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
      const token = new Users(payload).generateAuthToken();

      const res = await request(server)
        .post("/api/semesters")
        .set("x-auth-token", token)
        .send({ name: "Hoc ky 2" });

      expect(res.body).toHaveProperty("role", Users._id);
    });
  });
});
