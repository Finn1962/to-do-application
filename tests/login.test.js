const request = require("supertest");
const { app } = require("../app.js");

const { Users } = require("../src/db/queries.js");

const { comparePassword } = require("../src/middlewares/hash.js");

jest.mock("../src/middlewares/hash.js", () => ({
  comparePassword: jest.fn(),
}));

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
    comparePassword.mockResolvedValue(true);

    const response = await request(app)
      .post("/login")
      .send({ usernameOrEmail: "test-user", password: "test" });
    expect(response.statusCode).toBe(302);
  });
});
