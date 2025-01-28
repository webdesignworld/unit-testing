const mongoose = require('mongoose');

const functionInputDefinitionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  code_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Code', required: true },
});


const functionInputValueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  test_case_id: { type: mongoose.Schema.Types.ObjectId, ref: 'TestCase', required: true },
});


module.exports = {
  FunctionInputDefinition: mongoose.model('FunctionInputDefinition', functionInputDefinitionSchema),
  FunctionInputValue: mongoose.model('FunctionInputValue', functionInputValueSchema),
};
