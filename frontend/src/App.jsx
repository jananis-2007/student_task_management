import { useState, useEffect } from 'react';
import StatsBar from './components/StatsBar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  // System Health state
  const [healthData, setHealthData] = useState(null);
  const [healthStatus, setHealthStatus] = useState('checking'); // 'connected' | 'error' | 'checking'
  const [showHealthModal, setShowHealthModal] = useState(false);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Fetch system health
  const fetchHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setHealthData(data);
        setHealthStatus('connected');
      } else {
        setHealthStatus('error');
      }
    } catch {
      setHealthStatus('error');
    }
  };

  // Fetch all tasks from backend API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
      showToast('Error connecting to backend API', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchTasks();
  }, []);

  // Add Task
  const handleAddTask = async (newTaskData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create task');
      }

      const createdTask = await res.json();
      setTasks((prev) => [createdTask, ...prev]);
      showToast(`Task "${createdTask.title}" added successfully!`);
    } catch (err) {
      console.error(err);
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Task Completion
  const handleToggleStatus = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      );

      showToast(
        newStatus === 'completed'
          ? '🎉 Task completed!'
          : 'Task marked as pending.'
      );
    } catch (err) {
      console.error(err);
      showToast('Failed to update task status', 'error');
      fetchTasks(); // Revert on failure
    }
  };

  // Delete Task
  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!window.confirm(`Delete task "${taskToDelete?.title || 'this task'}"?`)) {
      return;
    }

    // Optimistic remove
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete task');
      showToast('Task deleted successfully');
    } catch (err) {
      console.error(err);
      showToast('Failed to delete task', 'error');
      fetchTasks(); // Revert on failure
    }
  };

  return (
    <div className="container app-layout">
      {/* Toast Notification */}
      {notification && (
        <div className={`toast toast-${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Top Header Bar */}
      <header className="app-header">
        <div className="header-branding">
          <span className="badge">Student Task Manager</span>
          <h1 className="title">Academic Workspace</h1>
          <p className="subtitle">Track assignments, projects, exams, and personal study goals.</p>
        </div>

        {/* System Health Pill */}
        <div className="header-meta">
          <button
            className={`health-pill ${healthStatus}`}
            onClick={() => setShowHealthModal(!showHealthModal)}
            title="Click to view full-stack system status"
          >
            <span className={`dot ${healthStatus}`} />
            <span>
              {healthStatus === 'connected'
                ? 'Backend & SQLite: Online'
                : healthStatus === 'checking'
                ? 'Checking backend...'
                : 'Backend: Offline'}
            </span>
          </button>
        </div>
      </header>

      {/* System Health Dropdown / Details */}
      {showHealthModal && (
        <div className="card health-modal">
          <div className="health-modal-header">
            <h4>System Diagnostics</h4>
            <button className="close-btn" onClick={() => setShowHealthModal(false)}>✕</button>
          </div>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label">Frontend</span>
              <span className="status-value"><span className="dot connected" /> React + Vite</span>
            </div>
            <div className="status-item">
              <span className="status-label">Backend API</span>
              <span className="status-value">
                <span className={`dot ${healthStatus}`} /> Express (Port 5000)
              </span>
            </div>
            <div className="status-item">
              <span className="status-label">Database</span>
              <span className="status-value">
                <span className={`dot ${healthStatus}`} />
                SQLite ({healthData?.database?.status || 'Active'})
              </span>
            </div>
          </div>
          {healthData && (
            <pre className="code-output">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Stats Overview */}
      <StatsBar tasks={tasks} />

      {/* Add Task Trigger / Form */}
      <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

      {/* Tasks List & Filters */}
      <TaskList
        tasks={tasks}
        onToggleStatus={handleToggleStatus}
        onDeleteTask={handleDeleteTask}
        isLoading={isLoading}
      />

      {/* Footer */}
      <footer className="footer">
        Student Task Management System &bull; College Project &bull; React + Express + SQLite
      </footer>
    </div>
  );
}

export default App;
