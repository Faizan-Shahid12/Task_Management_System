"use client"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home">
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <h1>Task Manager</h1>
            <p>Simple and effective task management for everyone</p>

            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary">
                    Get Started
                  </Link>
                  <Link to="/login" className="btn btn-secondary">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="features-section">
          <h2>Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Create Tasks</h3>
              <p>Add tasks with descriptions, due dates, and priority levels</p>
            </div>
            <div className="feature-card">
              <h3>Set Priorities</h3>
              <p>Organize tasks by high, medium, or low priority</p>
            </div>
            <div className="feature-card">
              <h3>Track Progress</h3>
              <p>Mark tasks complete and monitor your productivity</p>
            </div>
            <div className="feature-card">
              <h3>Stay Organized</h3>
              <p>Filter and sort tasks to find what you need</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
