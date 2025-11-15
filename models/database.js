const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "../data/migrations.db");
let db;

function initDatabase() {
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Error opening database:", err);
    } else {
      console.log("Database connected");
      createTables();
    }
  });
}

function createTables() {
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS account_migrations (
      move_id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      move_type TEXT NOT NULL,
      old_email TEXT,
      new_email TEXT NOT NULL,
      offboard_email TEXT,
      ga_account_id TEXT,
      gtm_account_id TEXT,
      gtm_container_id TEXT,
      old_location TEXT,
      new_location TEXT,
      offboard_location TEXT,
      agency_account_used TEXT,
      status TEXT DEFAULT 'pending',
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME
    )
  `;

  db.run(createTableSQL, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Database table ready");
    }
  });
}

function getDatabase() {
  return db;
}

module.exports = { initDatabase, getDatabase };
