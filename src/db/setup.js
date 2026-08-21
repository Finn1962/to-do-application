const { Client } = require("pg");

require("dotenv").config();

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password_hash TEXT NOT NULL
      );
    `);

    console.log("Created tables successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await client.end(); // Wird IMMER ausgeführt, auch bei Fehlern
  }
}

(async () => await createTables())();
