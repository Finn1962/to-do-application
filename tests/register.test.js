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
      password: "test-password",
      confirmPassword: "test-password",
    });

    expect(response.statusCode).toBe(200);
    expect(Users.createUser).toHaveBeenCalledWith(
      "test-user",
      expect.any(String),
    );
  });

  test("should not create a new user with invalid data", async () => {
    const response = await request(app).post("/register").send({
      username: "",
      password: "",
      confirmPassword: "",
    });

    expect(response.statusCode).toBe(400);
    expect(Users.createUser).not.toHaveBeenCalled();
  });

  test("should not create a new user with mismatched passwords", async () => {
    const response = await request(app).post("/register").send({
      username: "test-user",
      password: "test-password",
      confirmPassword: "test-confirmPassword",
    });

    expect(response.statusCode).toBe(400);
    expect(Users.createUser).not.toHaveBeenCalled();
  });
});
