const express = require("express");
const { Code } = require("../backend/models/challengesSchema"); 
const router = express.Router();

// POST route to create a new code entry
router.post("/create", async (req, res) => {
  const { function_name, content, language, challenge_id } = req.body;

  try {
    // Create a new code entry
    const newCode = new Code({
      function_name,
      content,
      language,
      challenge_id
    });

    // Save the code to the database
    await newCode.save();

    // Return the new code data
    res.status(201).json({
      message: "Code submitted successfully",
      code: newCode
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
