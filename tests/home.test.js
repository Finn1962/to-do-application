const request = require("supertest");
const { app } = require("../app.js");

const { Projects, Tasks } = require("../src/db/queries.js");

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
    getAllProjectsByUserId: jest.fn(),
  },
  Tasks: {
    getAllTasksAssignedToProjectId: jest.fn(),
  },
}));

describe("GET /", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render home page with projects and tasks", async () => {
    Projects.getAllProjectsByUserId.mockResolvedValue([
      { id: 2, title: "Project A" },
      { id: 3, title: "Project B" },
    ]);
    Tasks.getAllTasksAssignedToProjectId.mockResolvedValue([
      {
        id: 4,
        title: "Task 1",
        description: "Description 1",
        created_at: new Date("2026-08-01"),
      },
      {
        id: 5,
        title: "Task 2",
        description: "Description 2",
        created_at: new Date("2026-08-02"),
      },
    ]);

    const response = await request(app).get("/?projectId=3");

    expect(response.statusCode).toBe(200);
    expect(Projects.getAllProjectsByUserId).toHaveBeenCalledWith(1);
    expect(Tasks.getAllTasksAssignedToProjectId).toHaveBeenCalledWith(3, 1);
  });

  it("should render home page with projects and tasks", async () => {
    Projects.getAllProjectsByUserId.mockResolvedValue([
      { id: 2, title: "Project A" },
      { id: 3, title: "Project B" },
    ]);
    Tasks.getAllTasksAssignedToProjectId.mockResolvedValue([
      {
        id: 4,
        title: "Task 1",
        description: "Description 1",
        created_at: new Date("2026-08-01"),
      },
      {
        id: 5,
        title: "Task 2",
        description: "Description 2",
        created_at: new Date("2026-08-02"),
      },
    ]);

    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(Projects.getAllProjectsByUserId).toHaveBeenCalledWith(1);
    expect(Tasks.getAllTasksAssignedToProjectId).toHaveBeenCalledWith(2, 1);
  });
});
