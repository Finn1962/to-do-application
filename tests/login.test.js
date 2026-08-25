const request = require("supertest");
const { app } = require("../app.js");

const { Users } = require("../src/db/queries.js");

jest.mock("../src/db/queries.js", () => ({
  Users: {
    getUserDataByUsername: jest.fn(),
  },
}));

describe("/login", () => {
  Users.getUserDataByUsername.mockResolvedValue({
    username: "test-user",
    password_hash:
      "$2a$10$Mil3HRzjc8J/4cSXxf/4NueZm8ZAeU6Jw11c2jtzU8bhRQPmoHaC6",
  });

  it("should open login side", async () => {
    const response = await request(app).get("/login");
    expect(response.statusCode).toBe(200);
  });

  it("should login user", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "test-user", password: "test" });
    expect(response.statusCode).toBe(302);
  });

  it("should not login user", async () => {
    const response = await request(app)
      .post("/login")
      .send({ username: "test-user", password: "wrong-password" });
    expect(response.statusCode).toBe(401);
  });
});
