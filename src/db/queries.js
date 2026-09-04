const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Users {
  static async createUser({ name, email, password }) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO users (username, email, password_hash) 
        VALUES ($1, $2, $3) RETURNING verification_token, id`,
        [name, email, password],
      );
      return rows[0];
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async activateUserAccount(verificationToken, userId) {
    try {
      const { rowCount } = await pool.query(
        `UPDATE users SET is_verified = $1 
        WHERE id = $2 AND verification_token = $3 RETURNING *`,
        [true, userId, verificationToken],
      );
      if (rowCount === 0) return false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static async getUserDataByUsername(username) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
      );
      return rows[0];
    } catch (error) {
      console.error(error);
    }
  }
}

class Projects {
  static async createProject(title, userId) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO projects (user_id, title) VALUES ($1, $2) RETURNING id",
        [userId, title],
      );
      return rows[0].id;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllProjectsByUserId(userId) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM projects WHERE user_id = $1 ORDER BY id ASC",
        [userId],
      );
      return rows;
    } catch (error) {
      console.error(error);
    }
  }

  static async getProjectByProjectId(projectId, userId) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM projects WHERE id = $1 AND user_id = $2",
        [projectId, userId],
      );
      return rows[0];
    } catch (error) {
      console.error(error);
    }
  }

  static async editProject({ projectId, title, userId }) {
    try {
      await pool.query(
        "UPDATE projects SET title = $1 WHERE id = $2 AND user_id = $3",
        [title, projectId, userId],
      );
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteTask(projectId, userId) {
    try {
      await pool.query("DELETE FROM projects WHERE id = $1 AND user_id = $2", [
        projectId,
        userId,
      ]);
    } catch (error) {
      console.error(error);
    }
  }
}

class Tasks {
  static async createTask({ userId, projectId, title, description }) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO tasks (user_id, project_id, title, description) VALUES ($1, $2, $3, $4) RETURNING id",
        [userId, projectId, title, description],
      );
      return rows[0].id;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllTasksByUserId(userId) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM tasks WHERE user_id = $1 ORDER BY id ASC",
        [userId],
      );
      return rows;
    } catch (error) {
      console.error(error);
    }
  }

  static async getAllTasksAssignedToProjectId(projectId, userId) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM tasks WHERE project_id = $1 AND user_id = $2 ORDER BY id ASC",
        [projectId, userId],
      );
      return rows;
    } catch (error) {
      console.error(error);
    }
  }

  static async getTaskByTaskId(taskId, userId) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM tasks WHERE id = $1 AND user_id = $2",
        [taskId, userId],
      );
      return rows[0];
    } catch (error) {
      console.error(error);
    }
  }

  static async editTask({ taskId, title, description, userId }) {
    try {
      await pool.query(
        "UPDATE tasks SET title = $1, description = $2 WHERE id = $3 AND user_id = $4",
        [title, description, taskId, userId],
      );
    } catch (error) {
      console.error(error);
    }
  }

  static async completeTask({ taskState, taskId, userId }) {
    try {
      await pool.query(
        "UPDATE tasks SET completed = $1 WHERE id = $2 AND user_id = $3",
        [taskState, taskId, userId],
      );
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteTask(taskId, userId) {
    try {
      await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [
        taskId,
        userId,
      ]);
    } catch (error) {
      console.error(error);
    }
  }
}

/*Tasks.createTask({
  userId: 35,
  projectId: 5,
  title: "test-task",
  description: "test-description",
}).then((id) => console.log(id));
*/
module.exports = { Users, Projects, Tasks };
