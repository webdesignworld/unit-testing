
// const express = require("express");
// const { Challenge } = require("../backend/models/challengesSchema"); 
// const router = express.Router();

// // POST route to create a new challenge
// router.post("/create", async (req, res) => {
//   const { title, category, description, difficulty_level, manager_id } = req.body;

//   try {
//     // Create the new challenge
//     const newChallenge = new Challenge({
//       title,
//       category,
//       description,
//       difficulty_level,
//       manager_id
//     });

//     // Save the challenge to the database
//     await newChallenge.save();

//     // Return the new challenge data (excluding _id if needed)
//     res.status(201).json({
//       message: "Challenge created successfully",
//       challenge: newChallenge
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = router;


// backend/routes/challengeRoutes.js
const express = require("express");
const router = express.Router();
const Challenge = require("../models/challengesSchema");
const Submission = require("../models/submissionSchema");
const authMiddleware = require("../middleware/authMiddleware");

// GET /challenges - Protected Route
router.get("/", authMiddleware(["Coder", "Manager"]), async (req, res) => {
  try {
    if (req.user.role === "Manager") {
      // Managers can see all challenges with submission details
      const challenges = await Challenge.find()
        .populate({
          path: "submissions",
          match: { coderId: req.user.userId }, // Optional: Filter submissions by user
          select: "passedGrading finalScore code coderId",
        })
        .populate("managerId", "first_name last_name email") // Optional: Include manager details
        .lean();

      res.status(200).json(challenges);
    } else if (req.user.role === "Coder") {
      // Coders see challenges along with their submission status
      const challenges = await Challenge.find()
        .populate({
          path: "submissions",
          match: { coderId: req.user.userId },
          select: "passedGrading finalScore code",
        })
        .lean();

      // Optionally, format the response to include status
      const formattedChallenges = challenges.map((challenge) => {
        const submission = challenge.submissions[0]; // Assuming one submission per coder per challenge
        let status = "Not Attempted";

        if (submission) {
          status = submission.passedGrading ? "Completed" : "Attempted";
        }

        return {
          ...challenge,
          status,
        };
      });

      res.status(200).json(formattedChallenges);
    }
  } catch (error) {
    console.error("Error fetching challenges:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
