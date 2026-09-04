const request = require("supertest");
const { app } = require("../app.js");

jest.mock("express-session", () => {
  return () => (req, res, next) => {
    req.session = {
      user: { id: 1, name: "Finn Schmidt" },
    };
    next();
  };
});

jest.mock("../src/utils/accountsCleanup.js", () => ({
  accountsCleanup: jest.fn(),
}));

describe("GET /", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should show settings", async () => {
    const response = await request(app).get("/settings");
  });
});
