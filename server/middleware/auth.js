const jwt = require("jsonwebtoken")
const User = require("../models/User")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Find user by ID from token
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "Token is not valid - user not found" })
    }

    // Add user info to request object
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
    }

    next()
  } catch (error) {
    console.error("Auth middleware error:", error)

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" })
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }

    res.status(401).json({ message: "Token is not valid" })
  }
}

module.exports = auth
