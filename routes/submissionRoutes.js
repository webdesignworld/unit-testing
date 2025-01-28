const express = require("express");
const { Submission } = require("../backend/models/challengesSchema"); 
const router = express.Router();

// POST route to create a new submission
router.post("/create", async (req, res) => {
  const { passed_grading, final_score, code, challenge_id, coder_id } = req.body;

  try {
    // Create a new submission
    const newSubmission = new Submission({
      passed_grading,
      final_score,
      code,
      challenge_id,
      coder_id
    });

    // Save the submission to the database
    await newSubmission.save();

    // Return the new submission data
    res.status(201).json({
      message: "Submission created successfully",
      submission: newSubmission
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
