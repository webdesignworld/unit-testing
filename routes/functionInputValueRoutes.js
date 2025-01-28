const express = require("express");
const { FunctionInputValue } = require("../backend/models/functionSchema"); 
const router = express.Router();

// POST route to create a new function input value
router.post("/create", async (req, res) => {
  const { name, value, test_case_id } = req.body;

  try {
    // Create the new function input value
    const newFunctionInputValue = new FunctionInputValue({
      name,
      value,
      test_case_id
    });

    // Save the function input value to the database
    await newFunctionInputValue.save();

    // Return the new function input value data
    res.status(201).json({
      message: "Function input value created successfully",
      functionInputValue: newFunctionInputValue
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
