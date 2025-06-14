"use client"

import { createContext, useContext, useState } from "react"
import axios from "axios"

const TaskContext = createContext()

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await axios.get("/api/tasks")
      setTasks(response.data.tasks || response.data)
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch tasks"
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData) => {
    try {
      setLoading(true)
      setError("")

      const response = await axios.post("/api/tasks", taskData)
      const newTask = response.data.task || response.data
      setTasks([...tasks, newTask])

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create task"
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const updateTask = async (id, taskData) => {
    try {
      setLoading(true)
      setError("")

      const response = await axios.put(`/api/tasks/${id}`, taskData)
      const updatedTask = response.data.task || response.data
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)))

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update task"
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    try {
      setLoading(true)
      setError("")

      await axios.delete(`/api/tasks/${id}`)
      setTasks(tasks.filter((task) => task.id !== id))

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete task"
      setError(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const toggleTaskStatus = async (id) => {
    try {
      const response = await axios.patch(`/api/tasks/${id}/toggle`)
      const updatedTask = response.data.task || response.data
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)))

      return { success: true }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to toggle task status"
      setError(message)
      return { success: false, message }
    }
  }

  const clearError = () => {
    setError("")
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        clearError,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export const useTask = () => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
}
