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

describe("/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("test", async () => {
    const response = await request(app).get("/project/new");
  });
});
