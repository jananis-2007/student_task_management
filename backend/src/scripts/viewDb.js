const path = require('path');
const sqlite3 = require('sqlite3').verbose();

// Always resolves to the correct database file regardless of where you run it from
const dbPath = path.join(__dirname, '../../data/tasks.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('❌ Could not open database at:', dbPath);
    console.error(err.message);
    process.exit(1);
  }
});

console.log('\n📦 Database File:', dbPath);
console.log('📋 Fetching all tasks from SQLite database...\n');

db.all('SELECT id, title, category, priority, status, due_date, created_at FROM tasks', (err, rows) => {
  if (err) {
    console.error('❌ Error querying tasks:', err.message);
  } else if (!rows || rows.length === 0) {
    console.log('ℹ️ The tasks table is currently empty.');
  } else {
    console.table(rows);
    console.log(`✨ Total tasks in database: ${rows.length}\n`);
  }
  db.close();
});
