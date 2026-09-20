import { useState } from 'react';

const CATEGORIES = ['Assignment', 'Exam Prep', 'Project', 'Reading', 'Personal'];
const PRIORITIES = ['Low', 'Medium', 'High'];

function TaskForm({ onAddTask, isSubmitting }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Assignment');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setFormError('Please enter a task title');
      return;
    }

    setFormError('');
    onAddTask({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      due_date: dueDate,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setDueDate('');
    setPriority('Medium');
    setCategory('Assignment');
    setIsOpen(false);
  };

  return (
    <div className="task-form-container">
      {!isOpen ? (
        <button 
          id="open-task-form-btn"
          className="button primary-btn add-btn-large" 
          onClick={() => setIsOpen(true)}
        >
          <span className="plus-icon">+</span> Add New Student Task
        </button>
      ) : (
        <form className="task-form card" onSubmit={handleSubmit}>
          <div className="form-header">
            <h3>Add New Task</h3>
            <button 
              type="button" 
              className="close-btn" 
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
          </div>

          {formError && <div className="form-error-msg">{formError}</div>}

          <div className="form-group">
            <label htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Operating Systems Assignment 3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="task-due-date">Due Date</label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-desc">Description (Optional)</label>
            <textarea
              id="task-desc"
              rows="3"
              placeholder="Add details, submission links, notes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="button cancel-btn"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <button
              id="save-task-btn"
              type="submit"
              className="button primary-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Task'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default TaskForm;
