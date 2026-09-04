const request = require("supertest");
const { app } = require("../app.js");

const { Tasks } = require("../src/db/queries.js");

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

jest.mock("../src/db/queries.js", () => ({
  Tasks: {
    createTask: jest.fn(),
    editTask: jest.fn(),
    getTaskByTaskId: jest.fn(),
    completeTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

jest.mock("../src/utils/sanitizer.js", () => ({
  sanitizeHtml: jest.fn((input) => input),
}));

describe("/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display the new task form", async () => {
    const response = await request(app).get("/task/new/2");
    expect(response.status).toBe(200);
  });

  it("should create a new task", async () => {
    const response = await request(app).post("/task/new").send({
      title: "Test Task",
      projectId: 2,
      description: "Test Description",
    });

    expect(response.status).toBe(302);
    expect(Tasks.createTask).toHaveBeenCalledWith({
      userId: 1,
      projectId: 2,
      title: "Test Task",
      description: "Test Description",
    });
  });

  it("should display the edit task form", async () => {
    Tasks.getTaskByTaskId.mockResolvedValue({
      id: 2,
      user_id: 1,
      title: "test-task",
      description: "this is a test task",
      completed: false,
      created_at: "2026-08-25 15:18:10.112451",
    });
    const response = await request(app).get("/task/edit/2");
    expect(Tasks.getTaskByTaskId).toHaveBeenCalledWith(2, 1);
    expect(response.statusCode).toBe(200);
  });

  it("should edit the task", async () => {
    const response = await request(app).put("/task/edit").send({
      taskId: 1,
      title: "edited task",
      description: "i edited this task",
    });

    expect(Tasks.editTask).toHaveBeenCalledWith({
      taskId: 1,
      title: "edited task",
      description: "i edited this task",
      userId: 1,
    });
    expect(response.statusCode).toBe(200);
  });

  it("should set task on complete", async () => {
    const response = await request(app).patch("/task/complete").send({
      taskId: 2,
      taskState: true,
    });

    expect(response.statusCode).toBe(200);
    expect(Tasks.completeTask).toHaveBeenCalledWith({
      taskId: 2,
      taskState: true,
      userId: 1,
    });
  });

  it("should show delete form", async () => {
    const response = await request(app).get("/task/delete/2");

    expect(response.statusCode).toBe(200);
  });

  it("should delete task", async () => {
    const response = await request(app).delete("/task/delete/2");

    expect(response.statusCode).toBe(200);
    expect(Tasks.deleteTask).toHaveBeenCalledWith(2, 1);
  });
});
