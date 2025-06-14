const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const overdueTasks = tasks.filter(
    (task) => !task.completed && task.dueDate && new Date(task.dueDate) < new Date(),
  ).length

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="task-stats">
      <h3>Quick Stats</h3>

      <div className="stat-item">
        <span className="stat-label">Total Tasks:</span>
        <span className="stat-value">{totalTasks}</span>
      </div>

      <div className="stat-item">
        <span className="stat-label">Completed:</span>
        <span className="stat-value completed">{completedTasks}</span>
      </div>

      <div className="stat-item">
        <span className="stat-label">Pending:</span>
        <span className="stat-value pending">{pendingTasks}</span>
      </div>

      <div className="stat-item">
        <span className="stat-label">Overdue:</span>
        <span className="stat-value overdue">{overdueTasks}</span>
      </div>

      <div className="completion-rate">
        <div className="completion-label">Completion Rate</div>
        <div className="completion-bar">
          <div className="completion-fill" style={{ width: `${completionRate}%` }}></div>
        </div>
        <div className="completion-percentage">{completionRate}%</div>
      </div>
    </div>
  )
}

export default TaskStats
