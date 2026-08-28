const request = require("supertest");
const { app } = require("../app.js");

const { Projects } = require("../src/db/queries.js");

jest.mock("express-session", () => {
  return () => (req, res, next) => {
    req.session = {
      user: { id: 1, name: "Finn Schmidt" },
    };
    next();
  };
});

jest.mock("../src/db/queries.js", () => ({
  Projects: {
    createProject: jest.fn(),
    getProjectByProjectId: jest.fn().mockResolvedValue({
      id: 2,
      title: "test-project",
      userId: 1,
    }),
    editProject: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

describe("/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should open new project form", async () => {
    const response = await request(app).get("/project/new");
    expect(response.statusCode).toBe(200);
  });

  it("should create new project", async () => {
    const response = await request(app)
      .post("/project/new")
      .send({ title: "test-task" });

    expect(response.statusCode).toBe(302);
    expect(Projects.createProject).toHaveBeenCalledWith("test-task", 1);
  });

  it("should open edit project form", async () => {
    const response = await request(app).get("/project/edit/2");

    expect(response.statusCode).toBe(200);
    expect(Projects.getProjectByProjectId).toHaveBeenCalledWith(2, 1);
  });

  it("should edit project", async () => {
    const response = await request(app).put("/project/edit").send({
      projectId: 2,
      title: "edited-test-task",
    });

    expect(response.statusCode).toBe(200);
    expect(Projects.editProject).toHaveBeenCalledWith({
      projectId: 2,
      title: "edited-test-task",
      userId: 1,
    });
  });

  it("should show delete form", async () => {
    const response = await request(app).get("/project/delete/2");

    expect(response.statusCode).toBe(200);
  });

  it("should delete project", async () => {
    const response = await request(app).delete("/project/delete/2");

    expect(response.statusCode).toBe(200);
    expect(Projects.deleteTask).toHaveBeenCalledWith(2, 1);
  });
});
