import mongoose from "mongoose";

//User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  phoneContact: String,
  password: {
    type: String,
    required: true
  },
  cummulativeUnits: {
    type: Number,
  },
  membershipDate: {
    type: Date,
    required: true
  },
  investmentAmount: {
    type: Number,
    required: true
  },
  investmentDate: {
    type: Date,
  },
  points: {
    type: Number,
    required: true
  },

  isAdmin: Boolean,
  displayName: String,
  photoURL: String,
})


export default mongoose.models.User || mongoose.model("User", UserSchema);