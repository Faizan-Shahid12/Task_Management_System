const express = require("express")
const cors = require("cors")
require("dotenv").config()

// Import database connection
const connectDB = require("./config/database")

const authRoutes = require("./routes/auth")
const taskRoutes = require("./routes/tasks")
const errorHandler = require("./middleware/errorHandler")

const app = express()
const PORT = process.env.PORT || 5000

// Connect to MongoDB Atlas
connectDB()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff")
  res.setHeader("X-Frame-Options", "DENY")
  res.setHeader("X-XSS-Protection", "1; mode=block")
  next()
})

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/tasks", taskRoutes)

// Error handling middleware
app.use(errorHandler)

// Health check route with database status
app.get("/api/health", async (req, res) => {
  try {
    const mongoose = require("mongoose")
    const dbStatus = mongoose.connection.readyState

    const statusMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }

    res.json({
      message: "Server is running!",
      database: "MongoDB Atlas",
      status: statusMap[dbStatus] || "unknown",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    })
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
      timestamp: new Date().toISOString(),
    })
  }
})

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    availableRoutes: [
      "GET /api/health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "GET /api/auth/profile",
      "GET /api/tasks",
      "POST /api/tasks",
      "PUT /api/tasks/:id",
      "DELETE /api/tasks/:id",
      "PATCH /api/tasks/:id/toggle",
      "GET /api/tasks/stats",
    ],
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`🔗 Client URL: ${process.env.CLIENT_URL || "http://localhost:3000"}`)
})
