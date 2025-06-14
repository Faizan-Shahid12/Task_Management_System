"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useTask } from "../context/TaskContext"

const Dashboard = () => {
  const { user } = useAuth()
  const { tasks, fetchTasks, createTask, updateTask, deleteTask, toggleTaskStatus, error, clearError } = useTask()
  const [filter, setFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  })

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        clearError()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, clearError])

  const handleCreateTask = async (e) => {
    e.preventDefault()
    const result = await createTask(taskForm)

    if (result.success) {
      setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" })
      setShowTaskForm(false)
    }
  }

  const handleUpdateTask = async (e) => {
    e.preventDefault()
    if (!editingTask) return

    const result = await updateTask(editingTask.id, taskForm)

    if (result.success) {
      setEditingTask(null)
      setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" })
      setShowTaskForm(false)
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask(taskId)
    }
  }

  const handleToggleComplete = async (taskId) => {
    await toggleTaskStatus(taskId)
  }

  const startEdit = (task) => {
    setEditingTask(task)
    setTaskForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    })
    setShowTaskForm(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high"
      case "medium":
        return "priority-medium"
      case "low":
        return "priority-low"
      default:
        return "priority-medium"
    }
  }

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === "all" || (filter === "completed" && task.completed) || (filter === "pending" && !task.completed)

    const priorityMatch = priorityFilter === "all" || task.priority === priorityFilter

    return statusMatch && priorityMatch
  })

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && dueDate !== ""
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <h1>Task Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {error && <div className="error-message">{error}</div>}

          <div className="dashboard-grid">
            <div className="sidebar">
              <div className="task-stats">
                <h3>Quick Stats</h3>
                <div className="stat-item">
                  <span>Total Tasks:</span>
                  <span className="stat-value">{tasks.length}</span>
                </div>
                <div className="stat-item">
                  <span>Completed:</span>
                  <span className="stat-value completed">{tasks.filter((t) => t.completed).length}</span>
                </div>
                <div className="stat-item">
                  <span>Pending:</span>
                  <span className="stat-value pending">{tasks.filter((t) => !t.completed).length}</span>
                </div>
                <div className="stat-item">
                  <span>Overdue:</span>
                  <span className="stat-value overdue">
                    {tasks.filter((t) => !t.completed && isOverdue(t.dueDate)).length}
                  </span>
                </div>
              </div>

              <div className="filters">
                <h3>Filters</h3>
                <div className="filter-group">
                  <label>Status</label>
                  <select value={filter} onChange={(e) => setFilter(e.target.value)} className="filter-select">
                    <option value="all">All Tasks</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Priority</label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="main-content">
              <div className="content-header">
                <h2>Your Tasks</h2>
                <button onClick={() => setShowTaskForm(true)} className="btn btn-primary">
                  Add New Task
                </button>
              </div>

              <div className="task-list">
                {filteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <h3>No tasks found</h3>
                    <p>Create your first task to get started!</p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`task-item ${task.completed ? "completed" : ""} ${
                        isOverdue(task.dueDate) && !task.completed ? "overdue" : ""
                      }`}
                    >
                      <div className="task-content">
                        <div className="task-header">
                          <h4 className={task.completed ? "completed-text" : ""}>{task.title}</h4>
                          <div className="task-badges">
                            <span className={`priority-badge ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                            {isOverdue(task.dueDate) && !task.completed && (
                              <span className="overdue-badge">Overdue</span>
                            )}
                          </div>
                        </div>
                        {task.description && (
                          <p className={`task-description ${task.completed ? "completed-text" : ""}`}>
                            {task.description}
                          </p>
                        )}
                        {task.dueDate && (
                          <div className="task-meta">
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="task-actions">
                        <button className="btn btn-sm btn-success" onClick={() => handleToggleComplete(task.id)}>
                          {task.completed ? "↶" : "✓"}
                        </button>
                        <button className="btn btn-sm btn-primary" onClick={() => startEdit(task)}>
                          Edit
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteTask(task.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTaskForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingTask ? "Edit Task" : "Create New Task"}</h3>
              <button
                onClick={() => {
                  setShowTaskForm(false)
                  setEditingTask(null)
                  setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" })
                }}
                className="close-button"
              >
                ×
              </button>
            </div>
            <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="task-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  required
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Enter task description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => {
                    setShowTaskForm(false)
                    setEditingTask(null)
                    setTaskForm({ title: "", description: "", dueDate: "", priority: "medium" })
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? "Update Task" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
