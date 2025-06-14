const express = require("express")
const { body } = require("express-validator")
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskStats,
} = require("../controllers/taskController")
const auth = require("../middleware/auth")

const router = express.Router()

// All routes require authentication
router.use(auth)

// Get all tasks with optional filtering and sorting
router.get("/", getTasks)

// Get task statistics
router.get("/stats", getTaskStats)

// Create task
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title is required and must be between 1-200 characters"),
    body("description").optional().isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
    body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
  ],
  createTask,
)

// Update task
router.put(
  "/:id",
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title is required and must be between 1-200 characters"),
    body("description").optional().isLength({ max: 1000 }).withMessage("Description cannot exceed 1000 characters"),
    body("priority").optional().isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
    body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
  ],
  updateTask,
)

// Delete task
router.delete("/:id", deleteTask)

// Toggle task status
router.patch("/:id/toggle", toggleTaskStatus)

module.exports = router
