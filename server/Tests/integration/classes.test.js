const request = require("supertest");
const { Classes } = require("../../models/classes");
//const { before, after } = require("lodash");
const { result } = require("lodash");
const mongoose = require("mongoose");
const { Semesters } = require("../../models/semesters");

describe("/api/classes", () => {
  let server;

  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Classes.remove();
    // await server.close();
  });
  describe("GET/", () => {
    it("should return all classes", async () => {
      Classes.collection.insertMany([{ role: "Lecturer1" }]);

      const res = await request(server).get("/api/classes");
      expect(res.status).toBe(401);
      expect(res.body.length).toBe(undefined);
    });
  });
  describe("GET/:id", () => {
    it("should return a classes if valid id is passed", async () => {
      const classes = new Classes({
        classTermId: "202_DIT0030_03",
        name: "CNTT",
        numOfCredits: "2",
        courseType: "LT",
        schoolYear: "K26T",
        startDate: "2021-02-28T17:00:00.000Z",
        endDate: "2021-05-16T17:00:00.000Z",
        room: "CS3.A.09.01",
        dayOfWeek: "2",
        numOfWeek: "11",
        session: "4-6",
        semester: {
          _id: new mongoose.Types.ObjectId().toHexString(),
          name: "hoc ky 2",
          symbol: "HK222",
          year: "2021-2022",
        },
        LectureMail: "Thien.187pm20583@vanlanguni.vn",
      });
      await classes.save();

      const res = await request(server).get(
        "/api/classes" + classes.classTermId
      );
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("semesterId", classes.semesterId);
    });
    it("should return 500 if invalid id is passed", async () => {
      const res = await request(server).get("/api/classes/1");
      expect(res.status).toBe(500);
    });
  });
  describe("POST/", () => {
    it("should return 400 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/classes")
        .send({ classTermId: "02_DIT0030_03" });
      expect(res.status).toBe(400);
    });
    it("should save the classes if it is valid", async () => {
      const myClass = new Classes({
        classTermId: "202_DIT0030_03",
        name: "CNTT",
        numOfCredits: "2",
        courseType: "LT",
        schoolYear: "K26T",
        startDate: "2021-02-28T17:00:00.000Z",
        endDate: "2021-05-16T17:00:00.000Z",
        room: "CS3.A.09.01",
        dayOfWeek: "2",
        numOfWeek: "11",
        session: "4-6",
        semester: {
          _id: new mongoose.Types.ObjectId().toHexString(),
          name: "hoc ky 2",
          symbol: "HK222",
          year: "2021-2022",
        },
        LectureMail: "Thien.187pm20583@vanlanguni.vn",
      });
      const res = await request(server)
        .post("/api/classes" + myClass.semesterId)

        .send({ classTermId: "202_DIT0030_03" });
      expect(res.body).toHaveProperty("semesterId", myClass.semesterId);
    });
    it("should return 404 if classes invalid", async () => {
      const semesters = new Semesters({
        _id: new mongoose.Types.ObjectId().toHexString(),
        name: "hoc ky 2",
        symbol: "HK222",
        year: "2021-2022",
      });
      const res = await request(server).get(
        "/api/classes" + semesters.semesterId
      );
      expect(res.status).toBe(404);
    });
    it("should return the classes if it valid", async () => {
      const classes = new Classes({
        classTermId: "202_DIT0030_03",
        name: "CNTT",
        numOfCredits: "2",
        courseType: "LT",
        schoolYear: "K26T",
        startDate: "2021-02-28T17:00:00.000Z",
        endDate: "2021-05-16T17:00:00.000Z",
        room: "CS3.A.09.01",
        dayOfWeek: "2",
        numOfWeek: "11",
        session: "4-6",
        LectureMail: "Thien.187pm20583@vanlanguni.vn",
        semester: {
          _id: new mongoose.Types.ObjectId().toHexString(),
          name: "hoc ky 2",
          symbol: "HK222",
          year: "2021-2022",
        },
      });
      const res = await request(server)
        .post("/api/classes" + classes.semesterId)

        .send({ classTermId: "202_DIT0030_03" });
      expect(res.body).toHaveProperty("SemesterId", Classes.semesterId);
    });
  });
});
