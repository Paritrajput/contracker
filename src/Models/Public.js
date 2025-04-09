import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String, 
    profilePic: String,
    authProvider: {
      type: String,
      enum: ["manual", "google"],
      default: "manual",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
