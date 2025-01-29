const challengeRoutes = require("./routes/challengeRoutes");
const codeRoutes = require("./routes/codeRoutes");
const testCaseRoutes = require("./routes/testCaseRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const functionInputDefinitionRoutes = require("./routes/functionInputDefinitionRoutes");
const functionInputValueRoutes = require("./routes/functionInputValueRoutes");

const environmentLoader = require("./environmentLoader");
environmentLoader(process.env.APP_ENV);

const express = require("express");

const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();

const connectDB = require("./backend/config/db");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/challenges", challengeRoutes);
app.use("/submissions", submissionRoutes);

if (require.main === module) {
  const port = process.env.PORT || 8000;
  app.listen(port, () => {
    console.log(
      `Server is running on port: ${port} in ${process.env.APP_ENV} environment`
    );
  });
}

module.exports = app;
