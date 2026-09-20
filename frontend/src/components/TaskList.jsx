import { useState } from 'react';
import TaskItem from './TaskItem';

const CATEGORIES = ['All', 'Assignment', 'Exam Prep', 'Project', 'Reading', 'Personal'];

function TaskList({ tasks, onToggleStatus, onDeleteTask, isLoading }) {
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks locally for instant, lag-free filtering
  const filteredTasks = tasks.filter((task) => {
    // Status filter
    if (statusFilter === 'pending' && task.status !== 'pending') return false;
    if (statusFilter === 'completed' && task.status !== 'completed') return false;

    // Category filter
    if (categoryFilter !== 'All' && task.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = (task.description || '').toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }

    return true;
  });

  return (
    <div className="task-list-section">
      {/* Filters Bar */}
      <div className="filters-bar card">
        {/* Status Tabs */}
        <div className="status-tabs">
          <button
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All ({tasks.length})
          </button>
          <button
            className={`tab-btn ${statusFilter === 'pending' ? 'active' : ''}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending ({tasks.filter((t) => t.status === 'pending').length})
          </button>
          <button
            className={`tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({tasks.filter((t) => t.status === 'completed').length})
          </button>
        </div>

        <div className="filter-controls">
          {/* Search */}
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* Category Filter */}
          <select
            className="category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'All' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-container">
        {isLoading ? (
          <div className="empty-state card">
            <p>Loading your tasks...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">📝</div>
            <h3>No tasks found</h3>
            <p className="empty-subtitle">
              {tasks.length === 0
                ? "You have no tasks yet. Click '+ Add New Student Task' above to add your first assignment!"
                : "No tasks match your current search or filter criteria."}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={onToggleStatus}
              onDeleteTask={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
