const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // 

router.get("/", authMiddleware(["Coder", "Manager"]), async (req, res) => {
  try {
    if (req.user.role === "Manager") {

      const challenges = await Challenge.find()
        .populate({
          path: "submissions",
          match: { coderId: req.user.userId }, 
          select: "passedGrading finalScore code coderId",
        })
        .populate("managerId", "first_name last_name email")
        .lean();

      res.status(200).json(challenges);
    } else if (req.user.role === "Coder") {
 
      const challenges = await Challenge.find()
        .populate({
          path: "submissions",
          match: { coderId: req.user.userId },
          select: "passedGrading finalScore code",
        })
        .lean();

 
      const formattedChallenges = challenges.map((challenge) => {
        const submission = challenge.submissions[0]; 
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
