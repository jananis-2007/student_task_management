function TaskItem({ task, onToggleStatus, onDeleteTask }) {
  const isCompleted = task.status === 'completed';

  // Format due date
  const getDueDateLabel = () => {
    if (!task.due_date) return null;

    const todayStr = new Date().toISOString().split('T')[0];
    const isOverdue = !isCompleted && task.due_date < todayStr;
    const isDueToday = !isCompleted && task.due_date === todayStr;

    return (
      <span className={`due-date-badge ${isOverdue ? 'overdue' : isDueToday ? 'today' : ''}`}>
        📅 {task.due_date} {isOverdue && '(Overdue)'} {isDueToday && '(Due Today)'}
      </span>
    );
  };

  return (
    <div className={`task-item card ${isCompleted ? 'task-completed' : ''}`}>
      <div className="task-checkbox-wrapper">
        <input
          type="checkbox"
          id={`task-check-${task.id}`}
          className="task-checkbox"
          checked={isCompleted}
          onChange={() => onToggleStatus(task.id, isCompleted ? 'pending' : 'completed')}
        />
      </div>

      <div className="task-main-content">
        <div className="task-header-row">
          <h4 className="task-title">{task.title}</h4>
          <div className="task-badges">
            <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
            <span className="category-badge">
              {task.category}
            </span>
          </div>
        </div>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-footer-row">
          {getDueDateLabel()}
          <span className="task-timestamp">
            Added {new Date(task.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="delete-icon-btn"
          title="Delete Task"
          onClick={() => onDeleteTask(task.id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskItem;
