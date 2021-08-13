const { Users } = require("../../models/users");
const { Classes } = require("../../models/classes");
const request = require("supertest");
const config = require("config");
const mongoose = require("mongoose");
let server;

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });

  afterEach(async () => {
    await Classes.remove();
    // await server.close();
  });

  let token;

  const exec = () => {
    return request(server)
      .post("/api/classes")
      .set("x-auth-token", token)
      .send({ _id: new mongoose.Types.ObjectId().toHexString() });
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

    token = new Users(payload).generateAuthToken();
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
