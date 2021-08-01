const { Users } = require("../../../models/users");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("user.generateAuthToken", () => {
  it("should return a valid", () => {
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
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject({
      _id: payloadId,
      mail: "thien.187pm20583@vanlanguni.vn",
      name: "TNT",
      role: "Admin",
    });
  });
});
