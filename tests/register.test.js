const request = require("supertest");
const { app } = require("../app.js");

const { Users } = require("../src/db/queries.js");

const { Mails } = require("../src/services/mailer.js");

const { hashPassword } = require("../src/middlewares/hash.js");

jest.mock("../src/utils/cleanups.js", () => ({
  accountsCleanup: jest.fn(),
  verificationTokenCleanup: jest.fn(),
}));

jest.mock("../src/db/queries.js", () => ({
  Users: {
    createUser: jest.fn(),
    getUserDataByUsername: jest.fn(),
    getUserDataByEmail: jest.fn(),
    getUserDataByUserId: jest.fn(),
    activateUserAccount: jest.fn(),
    generateNewVerificationToken: jest.fn(),
    changePasswordHashWhereTocken: jest.fn(),
  },
}));

jest.mock("../src/services/mailer.js", () => ({
  Mails: {
    sendVerification: jest.fn(),
    sendPasswordReset: jest.fn(),
    sendPasswordChanged: jest.fn(),
  },
}));

jest.mock("../src/utils/sampleProjects.js", () => ({
  addSampleProject: jest.fn(),
}));

jest.mock("../src/middlewares/hash.js", () => ({
  hashPassword: jest.fn(),
}));

describe("register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should open the registration page", async () => {
    const response = await request(app).get("/register");
    expect(response.statusCode).toBe(200);
  });

  test("should create a new user", async () => {
    hashPassword.mockResolvedValue(
      "$2b$10$ulX3RIF2nEYTAjt0A3XMQ.JeiDhf.Z8uYhFTYFy8QkNme7kVhXns.",
    );
    Users.createUser.mockResolvedValue({ verification_token: 123456, id: 1 });

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

  test("should verify user", async () => {
    Users.activateUserAccount.mockResolvedValue(true);

    const response = await request(app).get(
      "/register/verification/?verificationToken=123456&userId=1",
    );

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/login");
    expect(Users.activateUserAccount).toHaveBeenCalledWith(123456, 1);
  });

  test("should genereate a new verification token", async () => {
    Users.generateNewVerificationToken.mockResolvedValue({
      verification_token: 234567,
      email: "test@example.com",
      username: "test-user",
    });

    const response = await request(app)
      .patch("/register/newVerificationToken")
      .send({
        userId: 1,
      });

    expect(Users.generateNewVerificationToken).toHaveBeenCalledWith(1);
    expect(response.statusCode).toBe(200);
  });

  test("should open form to enter email for password reset", async () => {
    const response = await request(app).get("/register/forgotPassword");
    expect(response.statusCode).toBe(200);
  });

  test("should send email with link to reset password", async () => {
    Users.getUserDataByEmail.mockResolvedValue({ id: 1 });
    Users.generateNewVerificationToken.mockResolvedValue({
      verification_token: 123456,
      username: "test-user",
    });
    const response = await request(app).post("/register/forgotPassword").send({
      email: "test.email@gamil.com",
    });
    expect(response.statusCode).toBe(302);
    expect(Users.getUserDataByEmail).toHaveBeenCalledWith(
      "test.email@gamil.com",
    );
    expect(Users.generateNewVerificationToken).toHaveBeenCalledWith(1);
    expect(Mails.sendPasswordReset).toHaveBeenCalledWith({
      username: "test-user",
      userId: 1,
      email: "test.email@gamil.com",
      verificationToken: 123456,
    });
  });

  test("should open form to enter new password for password reset", async () => {
    const response = await request(app).get("/register/resetPassword/1/123456");
    expect(response.statusCode).toBe(200);
  });

  test("should reset password", async () => {
    hashPassword.mockResolvedValue(
      "$2b$10$ulX3RIF2nEYTAjt0A3XMQ.JeiDhf.Z8uYhFTYFy8QkNme7kVhXns.",
    );
    Users.changePasswordHashWhereTocken.mockResolvedValue(true);
    Users.getUserDataByUserId.mockResolvedValue({
      username: "test-user",
      email: "test@gmail.com",
    });

    const response = await request(app).patch("/register/resetPassword").send({
      verificationToken: 123456,
      userId: 1,
      password: "test_1234",
      confirmPassword: "test_1234",
    });

    expect(Users.changePasswordHashWhereTocken).toHaveBeenCalledWith({
      passwordHash: expect.any(String),
      userId: 1,
      verificationToken: 123456,
    });
    expect(hashPassword).toHaveBeenCalledWith("test_1234");
    expect(response.statusCode).toBe(200);
  });
});
