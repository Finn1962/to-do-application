const request = require("supertest");
const { app } = require("../app.js");

const mockDestroy = jest.fn((callback) => {
  if (callback) callback(null);
});

jest.mock("express-session", () => {
  return () => (req, res, next) => {
    req.session = {
      user: { id: 1, name: "Finn Schmidt" },
      destroy: mockDestroy,
    };
    next();
  };
});

describe("/login", () => {
  it("should logout user", async () => {
    const response = await request(app).get("/logout");
    expect(mockDestroy).toHaveBeenCalled();
    expect(response.statusCode).toBe(302);
  });
});
