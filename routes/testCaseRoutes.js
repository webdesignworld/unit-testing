const express = require("express");
const { TestCase } = require("../backend/models/challengesSchema");
const router = express.Router();


router.post("/create", async (req, res) => {
  const { weight, challenge_id } = req.body;

  try {

    const newTestCase = new TestCase({
      weight,
      challenge_id
    });


    await newTestCase.save();


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
