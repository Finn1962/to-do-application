const { Pool } = require("pg");

require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

class Users {
  static async createUser(username, passwordHash) {
    try {
      await pool.query(
        "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
        [username, passwordHash],
      );
    } catch (error) {
      console.error(error);
      throw error;
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
      throw error;
    }
  }
}

module.exports = { Users };
