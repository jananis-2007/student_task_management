function StatsBar({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-label">Total Tasks</span>
        <span className="stat-number">{total}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Pending</span>
        <span className="stat-number pending-color">{pending}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Completed</span>
        <span className="stat-number completed-color">{completed}</span>
      </div>

      <div className="stat-card progress-card">
        <div className="progress-header">
          <span className="stat-label">Completion Rate</span>
          <span className="stat-number-sm">{percent}%</span>
        </div>
        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default StatsBar;
