const request = require("supertest");
const { app } = require("../app.js");

const { Users } = require("../src/db/queries.js");

jest.mock("../src/db/queries.js", () => ({
  Users: {
    createUser: jest
      .fn()
      .mockResolvedValue({ verification_token: 123456, id: 1 }),
    getUserDataByUsername: jest.fn(),
    activateUserAccount: jest.fn(),
  },
}));

jest.mock("../src/services/mailer.js", () => ({
  sendVerificationMail: jest.fn(),
}));

jest.mock("../src/utils/sampleProjects.js", () => ({
  addSampleProject: jest.fn(),
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

  test("should verify user", async () => {
    Users.activateUserAccount.mockResolvedValue(true);

    const response = await request(app).get(
      "/register/verification/?verificationToken=123456&userId=1",
    );

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe("/login");
    expect(Users.activateUserAccount).toHaveBeenCalledWith(123456, 1);
  });
});
