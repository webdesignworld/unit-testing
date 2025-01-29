const jwt = require("jsonwebtoken");
const User = require("../backend/models/userSchema");
const dotenv = require("dotenv");

dotenv.config();

const authMiddleware = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found." });
      }

      req.user = { userId: user._id, role: user.role };

      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Invalid token." });
    }
  };
};

module.exports = authMiddleware; 
