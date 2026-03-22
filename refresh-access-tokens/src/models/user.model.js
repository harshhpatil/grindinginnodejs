import mongoose from "mongoose";
import bcrypt from "bcrypt";

// defining the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

// pre-save functionality hook
userSchema.pre("save", async function (next) {
  // hashing the password before saving it to the database
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 13);
});

// creating in-built password compare method
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

// exporting the user schema
export default mongoose.model("User", userSchema);
