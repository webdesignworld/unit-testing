// const mongoose = require("mongoose");

// const UserSchema = new mongoose.Schema({
//   first_name: { type: String, required: true },
//   last_name: { type: String, required: true },
//   email: { type: String, unique: true, required: true },
//   password: { type: String, required: true },
//   avatar: { type: String },
//   role: { type: String, enum: ["Coder", "Manager"], required: true },
//   description: { type: String }, // only pertinent to coders
//   score: { type: Number, default: 0 }, // only pertinent to coders 
// });

// module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Manager", "Coder"], required: true },
});

// Password hashing before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
