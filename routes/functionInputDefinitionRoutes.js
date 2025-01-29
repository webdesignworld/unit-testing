const express = require("express");
const { FunctionInputDefinition } = require("../backend/models/functionSchema"); 
const router = express.Router();


router.post("/create", async (req, res) => {
  const { name, type, code_id } = req.body;

  try {

    const newFunctionInputDefinition = new FunctionInputDefinition({
      name,
      type,
      code_id
    });


    await newFunctionInputDefinition.save();


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
