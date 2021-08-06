const { Users } = require("../../models/users");
const { Semesters } = require("../../models/semesters");
const request = require("supertest");
const mongoose = require("mongoose");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Semesters.remove({});
    server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/semesters")
      .set("x-auth-token", token)
      .send({ name: true, symbol: true, year: true });
  };
  beforeEach(() => {
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
    token = users.generateAuthToken();
  });

  it("should return 400 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });
  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });
});
