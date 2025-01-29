const express = require("express");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const User = require("../backend/models/userSchema"); 
const router = express.Router();

dotenv.config(); 


router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, avatar, role, description } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      avatar,
      role,
      description: role === "Coder" ? description : undefined,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        score: newUser.score, 
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ 
      message: "Login successful",
      token 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
