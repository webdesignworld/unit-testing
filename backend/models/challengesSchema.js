const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  difficulty_level: { type: String, required: true },
  manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Submission" }],
}, { timestamps: true });  

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
