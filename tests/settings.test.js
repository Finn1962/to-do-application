const request = require("supertest");
const { app } = require("../app.js");

const { Users } = require("../src/db/queries.js");

jest.mock("express-session", () => {
  return () => (req, res, next) => {
    req.session = {
      user: { id: 1, name: "Finn Schmidt" },
    };
    next();
  };
});

jest.mock("../src/middlewares/hash.js", () => ({
  hashPassword: jest.fn().mockResolvedValue("password-hash"),
}));

jest.mock("../src/services/mailer.js", () => ({
  Mails: {
    sendPasswordChanged: jest.fn(),
  },
}));

jest.mock("../src/db/queries.js", () => ({
  Users: {
    getUserDataByUsername: jest.fn().mockResolvedValue({
      username: "Finn Schmidt",
      email: "test.mail@gmail.com",
    }),
    changePasswordHash: jest.fn(),
    changeUsername: jest.fn(),
  },
}));

jest.mock("../src/utils/cleanups.js", () => ({
  accountsCleanup: jest.fn(),
  verificationTokenCleanup: jest.fn(),
}));

describe("settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should show settings", async () => {
    const response = await request(app).get("/settings");
    expect(response.statusCode).toBe(200);
    expect(Users.getUserDataByUsername).toHaveBeenCalledWith("Finn Schmidt");
  });

  test("should change userdata", async () => {
    const response = await request(app).patch("/settings/username").send({
      username: "test-user",
    });
    expect(Users.changeUsername).toHaveBeenCalledWith({
      username: "test-user",
      userId: 1,
    });
    expect(response.statusCode).toBe(200);
  });

  test("should change password", async () => {
    const response = await request(app).patch("/settings/password").send({
      password: "test1234",
      confirmPassword: "test1234",
    });
    expect(Users.changePasswordHash).toHaveBeenCalledWith("password-hash", 1);
    expect(response.statusCode).toBe(200);
  });
});
