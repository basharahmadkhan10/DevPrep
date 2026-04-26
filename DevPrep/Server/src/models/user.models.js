import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false, // Make optional for Google users
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true,
  },
  isGoogleUser: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: null,
  },
  refreshToken: {
    type: String,
    default: null,
  },
}, { timestamps: true });
const userModel = mongoose.model("user", userSchema);
export default userModel;
