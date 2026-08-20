const request = require("supertest");
const { app } = require("../app.js");

describe("/login", () => {
  it("test", async () => {
    const response = await request(app).get("/login");
    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  });
});
