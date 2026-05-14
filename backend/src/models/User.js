import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    trim: true,
    match: [/^\+251[0-9]{9}$/, "Please enter a valid Ethiopian phone number"]
  },
  pin: {
    type: String,
    required: [true, "PIN is required"],
    minlength: [4, "PIN must be at least 4 digits"],
    select: false
  },
  telebirrId: {
    type: String,
    default: null
  },
  profileImage: {
    type: String,
    default: null
  },
  preferredTheme: {
    type: String,
    enum: ["dark", "light"],
    default: "dark"
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash PIN before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("pin")) return next();
  this.pin = await bcrypt.hash(this.pin, 12);
  next();
});

// Compare PIN method
userSchema.methods.comparePin = async function(candidatePin) {
  return await bcrypt.compare(candidatePin, this.pin);
};

// Remove sensitive data from JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.pin;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model("User", userSchema);
