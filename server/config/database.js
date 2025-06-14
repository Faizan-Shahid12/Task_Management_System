const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    // MongoDB Atlas connection with enhanced options
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`)
    console.log(`📊 Database: ${conn.connection.name}`)

  } catch (error) {
    console.error("❌ Error connecting to MongoDB Atlas:", error.message)

    // Provide helpful error messages for common issues
    if (error.message.includes("authentication failed")) {
      console.error("🔐 Authentication failed. Please check your username and password in the connection string.")
    } else if (error.message.includes("network timeout")) {
      console.error("🌐 Network timeout. Please check your internet connection and Atlas network access settings.")
    } else if (error.message.includes("ENOTFOUND")) {
      console.error("🔍 DNS resolution failed. Please check your connection string format.")
    }

    process.exit(1)
  }
}

module.exports = connectDB
