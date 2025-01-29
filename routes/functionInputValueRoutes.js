const express = require("express");
const { FunctionInputValue } = require("../backend/models/functionSchema"); 
const router = express.Router();


router.post("/create", async (req, res) => {
  const { name, value, test_case_id } = req.body;

  try {

    const newFunctionInputValue = new FunctionInputValue({
      name,
      value,
      test_case_id
    });


    await newFunctionInputValue.save();


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
