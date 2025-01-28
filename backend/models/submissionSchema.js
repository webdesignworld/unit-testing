const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  passedGrading: { type: Boolean, required: true },
  finalScore: { type: Number, required: true },
  code: { type: String, required: true },
  challengeId: { type: mongoose.Schema.Types.ObjectId, ref: "Challenge", required: true },
  coderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Submission", submissionSchema);
