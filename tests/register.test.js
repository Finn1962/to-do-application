const request = require("supertest");
const { app } = require("../app.js");

const { Users } = require("../src/db/queries/users.js");

jest.mock("../src/db/queries/users.js", () => ({
  Users: {
    getUserDataByUsername: jest.fn(),
  },
}));

describe("/register", () => {
  test("test1", async () => {
    const response = await request(app).get("/register");
    expect(response.statusCode).toBe(200);
  });
});
