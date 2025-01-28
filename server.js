const express = require("express");

const port = process.env.PORT || 8000;

//added from config
const connectDB = require ('./backend/config/db')
const authRoutes = require("./routes/authRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const codeRoutes = require("./routes/codeRoutes");
const testCaseRoutes = require("./routes/testCaseRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const functionInputDefinitionRoutes = require("./routes/functionInputDefinitionRoutes");
const functionInputValueRoutes = require("./routes/functionInputValueRoutes");



// const cors = require('cors'); does not like it

// app.use(cors());

const app = express();

//add
connectDB(); 

// Middleware for parsing JSON
app.use(express.json());

//setup validators folder as a middleware for various API endpoints
//from userSchema
app.use("/auth", authRoutes); //for userSchema 

//from challengesSchema
app.use("/challenges", challengeRoutes); 
app.use("/submissions", submissionRoutes);
app.use("/codes", codeRoutes);
app.use("/test-cases", testCaseRoutes);

//from functionSchema
app.use("/function-input-definitions", functionInputDefinitionRoutes);
app.use("/function-input-values", functionInputValueRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
