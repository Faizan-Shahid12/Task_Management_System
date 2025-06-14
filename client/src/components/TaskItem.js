"use client"
import { useTask } from "../context/TaskContext"

const TaskItem = ({ task, onEdit }) => {
  const { deleteTask, toggleTaskStatus } = useTask()

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(task.id)
    }
  }

  const handleToggle = async () => {
    await toggleTaskStatus(task.id)
  }

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false
    return new Date(task.dueDate) < new Date()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString()
  }

  const getPriorityClass = (priority) => {
    return `priority-${priority}`
  }

  return (
    <div className={`task-item ${task.completed ? "completed" : ""} ${isOverdue() ? "overdue" : ""}`}>
      <div className="task-content">
        <div className="task-header">
          <h4 className={task.completed ? "completed-text" : ""}>{task.title}</h4>
          <div className="task-badges">
            <span className={`priority-badge ${getPriorityClass(task.priority)}`}>{task.priority}</span>
            {isOverdue() && <span className="overdue-badge">Overdue</span>}
          </div>
        </div>

        {task.description && (
          <p className={`task-description ${task.completed ? "completed-text" : ""}`}>{task.description}</p>
        )}

        {task.dueDate && (
          <div className="task-meta">
            <span className="due-date">📅 Due: {formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>

      <div className="task-actions">
        <button
          onClick={handleToggle}
          className={`btn btn-sm ${task.completed ? "btn-secondary" : "btn-success"}`}
          title={task.completed ? "Mark as pending" : "Mark as completed"}
        >
          {task.completed ? "↶" : "✓"}
        </button>

        <button onClick={() => onEdit(task)} className="btn btn-sm btn-primary" title="Edit task">
          ✏️
        </button>

        <button onClick={handleDelete} className="btn btn-sm btn-danger" title="Delete task">
          🗑️
        </button>
      </div>
    </div>
  )
}

export default TaskItem
