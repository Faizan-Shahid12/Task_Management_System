const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    dueDate: {
      type: Date,
      validate: {
        validator: (value) => !value || value >= new Date(),
        message: "Due date cannot be in the past",
      },
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Update completedAt when task is marked as completed
taskSchema.pre("save", function (next) {
  if (this.isModified("completed")) {
    if (this.completed) {
      this.completedAt = new Date()
    } else {
      this.completedAt = undefined
    }
  }
  next()
})

// Index for better query performance
taskSchema.index({ userId: 1, completed: 1 })
taskSchema.index({ userId: 1, priority: 1 })
taskSchema.index({ userId: 1, dueDate: 1 })

module.exports = mongoose.model("Task", taskSchema)
