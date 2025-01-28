const express = require("express");
const { FunctionInputDefinition } = require("../backend/models/functionSchema"); 
const router = express.Router();

// POST route to create a new function input definition
router.post("/create", async (req, res) => {
  const { name, type, code_id } = req.body;

  try {
    // Create the new function input definition
    const newFunctionInputDefinition = new FunctionInputDefinition({
      name,
      type,
      code_id
    });

    // Save the function input definition to the database
    await newFunctionInputDefinition.save();

    // Return the new function input definition data
    res.status(201).json({
      message: "Function input definition created successfully",
      functionInputDefinition: newFunctionInputDefinition
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
