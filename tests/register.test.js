const request = require("supertest");
const { app } = require("../app.js");

const { Users } = require("../src/db/queries.js");

jest.mock("../src/db/queries.js", () => ({
  Users: {
    createUser: jest.fn(),
    getUserDataByUsername: jest.fn(),
  },
}));

describe("/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should open the registration page", async () => {
    const response = await request(app).get("/register");
    expect(response.statusCode).toBe(200);
  });

  test("should create a new user", async () => {
    const response = await request(app).post("/register").send({
      username: "test-user",
      email: "test@example.com",
      password: "test-password",
      confirmPassword: "test-password",
    });

    expect(response.statusCode).toBe(200);
    expect(Users.createUser).toHaveBeenCalledWith({
      name: "test-user",
      email: "test@example.com",
      password: expect.any(String),
    });
  });
});
