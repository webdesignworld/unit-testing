const express = require("express");
const { Code } = require("../backend/models/challengesSchema"); 
const router = express.Router();


router.post("/create", async (req, res) => {
  const { function_name, content, language, challenge_id } = req.body;

  try {

    const newCode = new Code({
      function_name,
      content,
      language,
      challenge_id
    });


    await newCode.save();


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
