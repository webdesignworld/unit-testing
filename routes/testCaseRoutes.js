const express = require("express");
const { TestCase } = require("../backend/models/challengesSchema");
const router = express.Router();

// POST route to create a new test case
router.post("/create", async (req, res) => {
  const { weight, challenge_id } = req.body;

  try {
    // Create a new test case
    const newTestCase = new TestCase({
      weight,
      challenge_id
    });

    // Save the test case to the database
    await newTestCase.save();

    // Return the new test case data
    res.status(201).json({
      message: "Test case created successfully",
      testCase: newTestCase
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
