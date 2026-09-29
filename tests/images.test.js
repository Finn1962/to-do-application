import request from "supertest";
import { app } from "../app.js";

jest.mock("../src/utils/cleanups.js", () => ({
  accountsCleanup: jest.fn(),
  verificationTokenCleanup: jest.fn(),
}));

describe("Images", () => {
  it("should render send the logo", async () => {
    const response = await request(app).get("/images/logo-var-three");

    expect(response.statusCode).toBe(200);
  });
});
