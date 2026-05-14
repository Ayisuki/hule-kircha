import { User } from "../models/User.js";
import { generateToken } from "../middleware/auth.js";
import { validatePhone, validatePIN, sanitizeInput } from "../middleware/validate.js";
import bcrypt from "bcryptjs";

// @desc    Register/Login with Phone + PIN
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { phone, pin, name } = req.body;

    // Validation
    if (!phone || !pin) {
      return res.status(400).json({
        success: false,
        message: "Phone number and PIN are required"
      });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Ethiopian phone number (e.g., +251911234567)"
      });
    }

    if (!validatePIN(pin)) {
      return res.status(400).json({
        success: false,
        message: "PIN must be at least 4 digits"
      });
    }

    // Find user by phone
    let user = await User.findOne({ phone }).select("+pin");

    if (user) {
      // Existing user - verify PIN
      const isMatch = await user.comparePin(pin);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid PIN"
        });
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: user.toJSON(),
          token
        }
      });
    } else {
      // New user - register
      if (!name) {
        return res.status(400).json({
          success: false,
          message: "Name is required for new registration"
        });
      }

      const sanitizedName = sanitizeInput(name);

      user = await User.create({
        name: sanitizedName,
        phone,
        pin
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        data: {
          user: user.toJSON(),
          token
        }
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
};

// @desc    Login with Telebirr Profile
// @route   POST /api/auth/telebirr
// @access  Public
export const telebirrLogin = async (req, res) => {
  try {
    const { telebirrId, phone, name } = req.body;

    if (!telebirrId || !phone) {
      return res.status(400).json({
        success: false,
        message: "Telebirr ID and phone are required"
      });
    }

    let user = await User.findOne({ telebirrId });

    if (user) {
      user.lastLogin = new Date();
      await user.save();

      const token = generateToken(user._id);

      return res.status(200).json({
        success: true,
        message: "Telebirr login successful",
        data: {
          user: user.toJSON(),
          token
        }
      });
    }

    // Create new user from Telebirr
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required for new Telebirr registration"
      });
    }

    // Generate a random PIN for Telebirr users
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

    user = await User.create({
      name: sanitizeInput(name),
      phone,
      telebirrId,
      pin: randomPin
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Telebirr registration successful",
      data: {
        user: user.toJSON(),
        token,
        generatedPin: randomPin // User should change this
      }
    });
  } catch (error) {
    console.error("Telebirr login error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during Telebirr login"
    });
  }
};

// @desc    Forgot PIN - Reset PIN
// @route   POST /api/auth/forgot-pin
// @access  Public
export const forgotPIN = async (req, res) => {
  try {
    const { phone, newPin } = req.body;

    if (!phone || !newPin) {
      return res.status(400).json({
        success: false,
        message: "Phone number and new PIN are required"
      });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
      });
    }

    if (!validatePIN(newPin)) {
      return res.status(400).json({
        success: false,
        message: "New PIN must be at least 4 digits"
      });
    }

    const user = await User.findOne({ phone }).select("+pin");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number"
      });
    }

    // Hash new PIN
    user.pin = newPin;
    await user.save();

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "PIN reset successful",
      data: { token }
    });
  } catch (error) {
    console.error("Forgot PIN error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during PIN reset"
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, preferredTheme } = req.body;
    const updates = {};

    if (name) updates.name = sanitizeInput(name);
    if (preferredTheme) updates.preferredTheme = preferredTheme;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated",
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
