// const request = require("supertest");
// const mongoose = require("mongoose");
// const app = require("../server");


// const User = require("../backend/models/userSchema");
// const Challenge = require("../backend/models/challengesSchema");
// const Submission = require("../backend/models/functionSchema");

// describe("API Tests for Auth and Challenges", () => {
//   let managerToken;
//   let coderToken;
//   let coderId;
//   let challenge1Id;
//   let challenge2Id;

//   beforeAll(async () => {

//     await User.deleteMany({});
//     await Challenge.deleteMany({});
//     await Submission.deleteMany({});

//     // 1. Insert one coder and one manager  (make sure in caps)
//     const manager = await User.create({
//       first_name: "John",
//       last_name: "Manager",
//       email: "manager@test.com",
//       password: "manager123",
//       role: "Manager",
//     });
//     managerId = manager._id;

//     const coder = await User.create({
//       first_name: "John",
//       last_name: "Coder",
//       email: "coder@test.com",
//       password: "coder123",
//       role: "Coder",
//     });
//     coderId = coder._id;

//     // 2. Insert two challenges created by that manager    
//     const challenge1 = await Challenge.create({
//       title: "Easy Challenge",
//       category: "Algorithms",
//       description: "Solve a simple problem",
//       difficultyLevel: "Easy",
//       managerId: managerId,
//     });
//     challenge1Id = challenge1._id;

//     const challenge2 = await Challenge.create({
//       title: "Hard Challenge",
//       category: "Data Structures",
//       description: "Solve a complex problem",
//       difficultyLevel: "Hard",
//       managerId: managerId,
//     });
//     challenge2Id = challenge2._id;

    
//     // 3. Create two submissions , one for each challenge, the first on passes and the second one fails
//     await Submission.create({
//       passedGrading: true,
//       finalScore: 100,
//       code: 'console.log("Passed")',
//       challengeId: challenge1Id,
//       coderId: coderId,
//     });

//     await Submission.create({
//       passedGrading: false,
//       finalScore: 50,
//       code: 'console.log("Failed")', 
//       challengeId: challenge2Id,
//       coderId: coderId,
//     });
//   });

//   // 4. Create a test case that should return an unauthorized error when the user is not logged in.
//   test("Should return 401 Unauthorized when no token is provided", async () => {
//     const res = await request(app).get("/auth/challenges"); 
//     expect(res.statusCode).toBe(401);
//     expect(res.body.message).toMatch(/unauthorized/i);
//   });

//   // 5. Create a test case that should return an unauthorized error when the user passes an invalid token.
//   test("Should return 401 Unauthorized with invalid token", async () => {
//     const invalidToken = "Bearer INVALID_TOKEN";

//     const res = await request(app)
//       .get("/auth/challenges") 
//       .set("Authorization", invalidToken)
//       .send();

//     expect(res.statusCode).toBe(401);
//     expect(res.body).toHaveProperty("message");
//     expect(res.body.message).toMatch(/invalid token/i);
//   });
// });

//   // 6. Create a test case that should return a valid token when the correct credentials are passed to the login endpoint.

//   test("should return a valid token for manager login", async () => {
//     const res = await request(app)
//       .post("/auth/login")
//       .send({ email: "manager@test.com", password: "manager123" });
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("token");
//     managerToken = res.body.token;
//   });

//   test("should return a valid token for coder login", async () => {
//     const res = await request(app)
//       .post("/auth/login")
//       .send({ email: "coder@test.com", password: "coder123" });
//     expect(res.statusCode).toBe(200);
//     expect(res.body).toHaveProperty("token");
//     coderToken = res.body.token;
//   });

//   // 7. Create a test case that should return all the challenges for the coder after login.
//   test("Should return all challenges for the coder with one Completed and one Attempted", async () => {
//     const res = await request(app)
//       .get("/challenges") 
//       .set("Authorization", `Bearer ${coderToken}`)
//       .send();

//     expect(res.statusCode).toBe(200);
//     expect(Array.isArray(res.body)).toBe(true);
//     expect(res.body.length).toBe(2); 


//     let completedCount = 0;
//     let attemptedCount = 0;

  
//     for (const challenge of res.body) {
//       if (challenge.submissions && Array.isArray(challenge.submissions)) {
//         const submission = challenge.submissions.find(
//           (sub) => sub.coderId.toString() === coderId.toString()
//         );

//         if (submission) {
//           if (submission.passedGrading) {
//             completedCount += 1;
//           } else {
//             attemptedCount += 1;
//           }
//         }
//       }
//     }

//     expect(completedCount).toBe(1);
//     expect(attemptedCount).toBe(1);
//   });

//   // 6. You should remove all the test data that was previously inserted and close the Mongoose connection after all tests are done.

//   // __tests__/app.test.js

// afterAll(async () => {
//   try {
//     // Remove specific users
//     await User.deleteMany({ email: { $in: ["manager@test.com", "coder@test.com"] } });

//     // Remove specific challenges
//     await Challenge.deleteMany({ title: { $in: ["Easy Challenge", "Hard Challenge"] } });

//     // Remove submissions related to the coder
//     await Submission.deleteMany({ coderId: coderId });

//     console.log("Test data cleaned up successfully.");
//   } catch (error) {
//     console.error("Error during cleanup:", error);
//   } finally {
//     // Log before closing the connection
//     console.log("Closing Mongoose connection.");
    
//     // Close the Mongoose connection
//     await mongoose.connection.close();
     
//   }
// });



const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../server"); // Import the Express app without starting the server

// Import Models
const User = require("../backend/models/userSchema");
const Challenge = require("../backend/models/challengesSchema");
const Submission = require("../backend/models/submissionSchema"); 

describe("API Tests for Auth and Challenges", () => {
  let managerToken;
  let coderToken;
  let managerId; // Declared managerId
  let coderId;
  let challenge1Id;
  let challenge2Id;

  // Before all tests, set up test data
  beforeAll(async () => {
    // Ensure the database is connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    // Clean existing data to prevent interference
    await User.deleteMany({});
    await Challenge.deleteMany({});
    await Submission.deleteMany({});

    // 1. Insert one manager and one coder (ensure roles are capitalized as per your comment)
    const manager = await User.create({
      first_name: "John",
      last_name: "Manager",
      email: "manager@test.com",
      password: "manager123",
      role: "Manager",
    });
    managerId = manager._id;

    const coder = await User.create({
      first_name: "John",
      last_name: "Coder",
      email: "coder@test.com",
      password: "coder123",
      role: "Coder",
    });
    coderId = coder._id;

    // 2. Insert two challenges created by the manager
    const challenge1 = await Challenge.create({
      title: "Easy Challenge",
      category: "Algorithms",
      description: "Solve a simple problem",
      difficultyLevel: "Easy",
      managerId: managerId,
    });
    challenge1Id = challenge1._id;

    const challenge2 = await Challenge.create({
      title: "Hard Challenge",
      category: "Data Structures",
      description: "Solve a complex problem",
      difficultyLevel: "Hard",
      managerId: managerId,
    });
    challenge2Id = challenge2._id;

    // 3. Create two submissions: one passes, one fails
    const submission1 = await Submission.create({
      passedGrading: true,
      finalScore: 100,
      code: 'console.log("Passed")',
      challengeId: challenge1Id,
      coderId: coderId,
    });

    const submission2 = await Submission.create({
      passedGrading: false,
      finalScore: 50,
      code: 'console.log("Failed")',
      challengeId: challenge2Id,
      coderId: coderId,
    });

    // Optionally, link submissions to challenges if your schema requires it
    // await Challenge.findByIdAndUpdate(challenge1Id, { $push: { submissions: submission1._id } });
    // await Challenge.findByIdAndUpdate(challenge2Id, { $push: { submissions: submission2._id } });
  });

  // 4. Test unauthorized access without token
  test("Should return 401 Unauthorized when no token is provided", async () => {
    const res = await request(app).get("/challenges"); // Adjust the endpoint if necessary
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/unauthorized/i);
  });

  // 5. Test unauthorized access with invalid token
  test("Should return 401 Unauthorized with invalid token", async () => {
    const invalidToken = "Bearer INVALID_TOKEN";

    const res = await request(app)
      .get("/challenges") // Adjust the endpoint if necessary
      .set("Authorization", invalidToken)
      .send();

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/invalid token/i);
  });

  // 6. Test manager login and obtain token
  test("Should return a valid token for manager login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "manager@test.com", password: "manager123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    managerToken = res.body.token;

    // Optional: Verify token structure and payload
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty("userId");
    expect(decoded).toHaveProperty("role", "Manager");
  });

  // 6. Test coder login and obtain token
  test("Should return a valid token for coder login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "coder@test.com", password: "coder123" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    coderToken = res.body.token;

    // Optional: Verify token structure and payload
    const decoded = jwt.verify(res.body.token, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty("userId");
    expect(decoded).toHaveProperty("role", "Coder");
  });

  // 7. Test fetching challenges for coder
  test("Should return all challenges for the coder with one Completed and one Attempted", async () => {
    const res = await request(app)
      .get("/challenges") // Ensure this endpoint is protected and returns 'status'
      .set("Authorization", `Bearer ${coderToken}`)
      .send();

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2); // Expecting two challenges

    let completedCount = 0;
    let attemptedCount = 0;

    for (const challenge of res.body) {
      // Assuming each challenge includes a 'submissions' array
      if (challenge.submissions && Array.isArray(challenge.submissions)) {
        const submission = challenge.submissions.find(
          (sub) => sub.coderId.toString() === coderId.toString()
        );

        if (submission) {
          if (submission.passedGrading) {
            completedCount += 1;
          } else {
            attemptedCount += 1;
          }
        }
      } else {
        // Handle cases where 'submissions' might not be included
        // For example, if your API doesn't populate submissions
        // Adjust the logic accordingly
        // Alternatively, ensure your API returns submissions
        throw new Error("Submissions not included in challenge response");
      }
    }

    expect(completedCount).toBe(1);
    expect(attemptedCount).toBe(1);
  });

  // 8. Cleanup after all tests
  afterAll(async () => {
    try {
      // Remove specific submissions
      await Submission.deleteMany({ coderId: coderId });

      // Remove specific challenges
      await Challenge.deleteMany({ title: { $in: ["Easy Challenge", "Hard Challenge"] } });

      // Remove specific users
      await User.deleteMany({ email: { $in: ["manager@test.com", "coder@test.com"] } });

    
      await mongoose.connection.close();
     
    }
  });
});
