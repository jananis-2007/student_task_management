const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'tasks.db');

// Initialize SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database at:', dbPath);
    initDbSchema();
  }
});

/**
 * Initializes the required database tables
 */
function initDbSchema() {
  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      category TEXT DEFAULT 'Assignment',
      priority TEXT DEFAULT 'Medium',
      due_date TEXT DEFAULT '',
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  db.run(createTasksTable, (err) => {
    if (err) {
      console.error('❌ Error initializing tasks table:', err.message);
    } else {
      console.log('✅ Tasks table ready.');
    }
  });
}


/**
 * Health check helper to test SQLite database connection
 * @returns {Promise<boolean>}
 */
function checkDbConnection() {
  return new Promise((resolve) => {
    db.get('SELECT 1 AS connected', (err, row) => {
      if (err || !row || row.connected !== 1) {
        resolve({ connected: false, error: err ? err.message : 'No response' });
      } else {
        resolve({ connected: true, message: 'Database operational' });
      }
    });
  });
}

module.exports = {
  db,
  checkDbConnection,
  dbPath,
};
