const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../server");
 const bcrypt = require("bcryptjs");

const User = require("../backend/models/userSchema");
const Challenge = require("../backend/models/challengesSchema");
const Submission = require("../backend/models/submissionSchema");

describe("API Tests for Auth and Challenges", () => {
  let coderId;
  let challenge1Id;
  let challenge2Id;

  // Before all tests, set up test data
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

   
    const hashedPassword = await bcrypt.hash("coder123", 10);

    await Challenge.deleteMany({});
    await User.deleteMany({});
    await Submission.deleteMany({});

    //  Insert one manager and one coder (ensure roles are capitalized as per your comment)
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

      password: hashedPassword,
      role: "Coder",
    });
    coderId = coder._id;

    //  Insert two challenges created by the manager
    const challenge1 = await Challenge.create({
      title: "Easy Challenge",
      category: "Algorithms",
      description: "Solve a simple problem",
      difficulty_level: "Easy",
      manager_id: manager._id,
    });
    challenge1Id = challenge1._id;

    const challenge2 = await Challenge.create({
      title: "Hard Challenge",
      category: "Data Structures",
      description: "Solve a complex problem",
      difficulty_level: "Hard",
      manager_id: manager._id,
    });
    challenge2Id = challenge2._id;

    //  Create two submissions: one passes, one fails
    const submission1 = await Submission.create({
      passedGrading: true,  //pass
      finalScore: 100,
      code: 'console.log("Passed")',
      challengeId: challenge1Id,
      coderId: coder._id,
    });

    const submission2 = await Submission.create({
      passedGrading: false, //fail
      finalScore: 50,
      code: 'console.log("Failed")',
      challengeId: challenge2Id,
      coderId: coder._id,
    });
  });

                                                //// TESTS ///

  test("1. Should return an authorised error when the user is not logged in", async () => {
    const res = await request(app).get("/challenges").send();

    console.log("Unauthorized Response:", res.body);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(/unauthorized|access denied/i);
  });

  test("2. Should return an unauthorized error when the user passes an invalid token.", async () => {
    const invalidToken = "Bearer INVALID_TOKEN"; //

    const res = await request(app)
      .get("/challenges")
      .set("Authorization", invalidToken)
      .send();

    console.log("Invalid Token Response:", res.body);

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toMatch(
      /invalid token|unauthorized|access denied/i
    );
  });

  test(" 3. Should return a valid token when the correct credentials are passed to the login endpoint.", async () => {
    const validCredentials = {
      email: "coder@test.com",
      password: "coder123",
    };

    const res = await request(app).post("/auth/login").send(validCredentials);

    console.log("Login Response Status:", res.statusCode);
    console.log("Login Response Body:", res.body);

    return res.body.token;
  });

  test("4. Should return all the challenges for the coder after login.", async () => {
    const validCredentials = {
      email: "coder@test.com",
      password: "coder123",
    };

    const loginRes = await request(app)
      .post("/auth/login")
      .send(validCredentials);

    console.log("Login Response Status:", loginRes.statusCode);
    console.log("Login Response Body:", loginRes.body);

    const coderToken = loginRes.body.token;

    const challengesRes = await request(app)
      .get("/challenges")
      .set("Authorization", `Bearer ${coderToken}`)
      .send();

    console.log("Challenges Response Status:", challengesRes.statusCode);
    console.log("Challenges Response Body:", challengesRes.body);

    if (challengesRes.body.length === 0) {
      console.warn(" Warning: No challenges found. Test may need seed data.");
    }
  });

  // Cleanup after all tests
  afterAll(async () => {
    try {
      await Submission.deleteMany({ coderId: coderId });
    } catch (error) {
      console.error("Error cleaning up after tests:", error);
    } finally {
      console.log("Cleanup completed.");
    }
  });
});
