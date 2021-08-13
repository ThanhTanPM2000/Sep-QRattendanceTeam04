const { Users } = require("../../../models/users");
const auth = require("../../../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");
describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
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
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    auth(req, res, next);

    expect(decoded).toMatchObject({
      _id: payloadId,
      mail: "thien.187pm20583@vanlanguni.vn",
      name: "TNT",
      role: "Admin",
    });
  });
});
