// const mongoose = require("mongoose");

// const challengeSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   category: { type: String, required: true },
//   description: { type: String, required: true },
//   difficulty_level: { type: String, enum: ['Easy', 'Moderate', 'Hard'], required: true },
//   manager_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Manager', required: true },
// });


// const submissionSchema = new mongoose.Schema({
//   submission_time: { type: Date, default: Date.now },
//   passed_grading: { type: Boolean, required: true },
//   final_score: { type: Number, required: true },
//   code: { type: String, required: true },
//   challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
//   coder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Coder', required: true },
// });


// const codeSchema = new mongoose.Schema({
//   function_name: { type: String, required: true },
//   content: { type: String, required: true },
//   language: { type: String, required: true },
//   challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
// });


// const testCaseSchema = new mongoose.Schema({
//         weight: { type: Number, required: true },
//         challenge_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
//       });

// module.exports = {
//   Challenge: mongoose.model('Challenge', challengeSchema),
//   Submission: mongoose.model('Submission', submissionSchema),
//   Code: mongoose.model('Code', codeSchema),
//   TestCase: mongoose.model('TestCase', testCaseSchema),
// };

const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  difficultyLevel: { type: String, enum: ["Easy", "Hard"], required: true },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
});

module.exports = mongoose.model("Challenge", challengeSchema);
