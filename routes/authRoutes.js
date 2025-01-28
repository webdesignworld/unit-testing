const express = require("express");
const bcrypt = require("bcrypt"); 
const User = require("../backend/models/userSchema"); 
const router = express.Router();

// Register User route
router.post("/register", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    avatar,
    role,
    description, // only pertinent to coders
  } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving (bcrypt lib)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the user data
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      avatar,
      role,
      description: role === "Coder" ? description : undefined, // Only add description if role is Coder
    });

    // Save the user to the database
    await newUser.save();

    // Respond with the new user's data (excluding the password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
        score: newUser.score, // Add score for coders only
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
