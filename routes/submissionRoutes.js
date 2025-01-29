const express = require("express");
const { Submission } = require("../backend/models/challengesSchema"); 
const router = express.Router();


router.post("/create", async (req, res) => {
  const { passed_grading, final_score, code, challenge_id, coder_id } = req.body;

  try {

    const newSubmission = new Submission({
      passed_grading,
      final_score,
      code,
      challenge_id,
      coder_id
    });


    await newSubmission.save();


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
