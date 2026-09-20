const express = require('express');
const router = express.Router();
const { db } = require('../config/db');

/**
 * @route   GET /api/tasks
 * @desc    Fetch all tasks with optional filters (status, category, search)
 */
router.get('/', (req, res) => {
  const { status, category, search } = req.query;

  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params = [];

  if (status && status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  if (category && category !== 'all') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    query += ' AND (title LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Order priority: High -> Medium -> Low, then by due date
  query += ` ORDER BY 
    CASE priority 
      WHEN 'High' THEN 1 
      WHEN 'Medium' THEN 2 
      WHEN 'Low' THEN 3 
      ELSE 4 
    END,
    CASE WHEN due_date = '' OR due_date IS NULL THEN 1 ELSE 0 END,
    due_date ASC,
    created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Error fetching tasks:', err.message);
      return res.status(500).json({ error: 'Failed to fetch tasks', details: err.message });
    }
    res.json(rows);
  });
});

/**
 * @route   GET /api/tasks/:id
 * @desc    Fetch a single task by ID
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error fetching task by id:', err.message);
      return res.status(500).json({ error: 'Failed to fetch task' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(row);
  });
});

/**
 * @route   POST /api/tasks
 * @desc    Create a new student task
 */
router.post('/', (req, res) => {
  const { title, description = '', category = 'Assignment', priority = 'Medium', due_date = '' } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Task title is required' });
  }

  const query = `
    INSERT INTO tasks (title, description, category, priority, due_date, status)
    VALUES (?, ?, ?, ?, ?, 'pending')
  `;

  db.run(query, [title.trim(), description.trim(), category, priority, due_date], function (err) {
    if (err) {
      console.error('Error creating task:', err.message);
      return res.status(500).json({ error: 'Failed to create task', details: err.message });
    }

    const newTaskId = this.lastID;
    db.get('SELECT * FROM tasks WHERE id = ?', [newTaskId], (getErr, row) => {
      if (getErr) {
        return res.status(201).json({ id: newTaskId, title, status: 'pending' });
      }
      res.status(201).json(row);
    });
  });
});

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task details or toggle completion status
 */
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, category, priority, due_date, status } = req.body;

  // First verify task exists
  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, currentTask) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!currentTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTitle = title !== undefined ? title.trim() : currentTask.title;
    const updatedDescription = description !== undefined ? description.trim() : currentTask.description;
    const updatedCategory = category !== undefined ? category : currentTask.category;
    const updatedPriority = priority !== undefined ? priority : currentTask.priority;
    const updatedDueDate = due_date !== undefined ? due_date : currentTask.due_date;
    const updatedStatus = status !== undefined ? status : currentTask.status;

    if (!updatedTitle) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    const updateQuery = `
      UPDATE tasks
      SET title = ?, description = ?, category = ?, priority = ?, due_date = ?, status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    db.run(
      updateQuery,
      [updatedTitle, updatedDescription, updatedCategory, updatedPriority, updatedDueDate, updatedStatus, id],
      function (updateErr) {
        if (updateErr) {
          console.error('Error updating task:', updateErr.message);
          return res.status(500).json({ error: 'Failed to update task' });
        }

        db.get('SELECT * FROM tasks WHERE id = ?', [id], (fetchErr, updatedRow) => {
          if (fetchErr) {
            return res.json({ id, message: 'Task updated successfully' });
          }
          res.json(updatedRow);
        });
      }
    );
  });
});

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 */
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error deleting task:', err.message);
      return res.status(500).json({ error: 'Failed to delete task' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully', id: Number(id) });
  });
});

module.exports = router;
