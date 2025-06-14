const { validationResult } = require("express-validator")
const Task = require("../models/Task")

const getTasks = async (req, res) => {
  try {
    const { status, priority, sortBy = "createdAt", sortOrder = "desc" } = req.query

    // Build query
    const query = { userId: req.user.id }

    if (status === "completed") {
      query.completed = true
    } else if (status === "pending") {
      query.completed = false
    }

    if (priority && priority !== "all") {
      query.priority = priority
    }

    // Build sort object
    const sort = {}
    sort[sortBy] = sortOrder === "asc" ? 1 : -1

    const tasks = await Task.find(query).sort(sort).populate("userId", "name email")

    res.json({
      tasks,
      count: tasks.length,
      filters: { status, priority, sortBy, sortOrder },
    })
  } catch (error) {
    console.error("Get tasks error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

const createTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { title, description, dueDate, priority } = req.body

    const task = new Task({
      title,
      description: description || "",
      dueDate: dueDate || null,
      priority: priority || "medium",
      userId: req.user.id,
    })

    await task.save()

    res.status(201).json({
      message: "Task created successfully",
      task,
    })
  } catch (error) {
    console.error("Create task error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors[0] })
    }

    res.status(500).json({ message: "Internal server error" })
  }
}

const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array(),
      })
    }

    const { id } = req.params
    const { title, description, dueDate, priority } = req.body

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      {
        title,
        description: description || "",
        dueDate: dueDate || null,
        priority: priority || "medium",
      },
      { new: true, runValidators: true },
    )

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({
      message: "Task updated successfully",
      task,
    })
  } catch (error) {
    console.error("Update task error:", error)

    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message)
      return res.status(400).json({ message: errors[0] })
    }

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
}

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    res.json({
      message: "Task deleted successfully",
      deletedTask: task,
    })
  } catch (error) {
    console.error("Delete task error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
}

const toggleTaskStatus = async (req, res) => {
  try {
    const { id } = req.params

    const task = await Task.findOne({ _id: id, userId: req.user.id })

    if (!task) {
      return res.status(404).json({ message: "Task not found" })
    }

    task.completed = !task.completed
    await task.save() // This will trigger the pre-save hook to set completedAt

    res.json({
      message: "Task status updated successfully",
      task,
    })
  } catch (error) {
    console.error("Toggle task error:", error)

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid task ID" })
    }

    res.status(500).json({ message: "Internal server error" })
  }
}

// Get task statistics
const getTaskStats = async (req, res) => {
  try {
    const userId = req.user.id

    const stats = await Task.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ["$completed", 1, 0] } },
          pending: { $sum: { $cond: ["$completed", 0, 1] } },
          high: { $sum: { $cond: [{ $eq: ["$priority", "high"] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ["$priority", "medium"] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ["$priority", "low"] }, 1, 0] } },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$completed", false] },
                    { $lt: ["$dueDate", new Date()] },
                    { $ne: ["$dueDate", null] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ])

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      high: 0,
      medium: 0,
      low: 0,
      overdue: 0,
    }

    res.json({ stats: result })
  } catch (error) {
    console.error("Get task stats error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStats,
}
