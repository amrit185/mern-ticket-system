// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // .js extension is required in ES modules
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// REGISTER ROUTE
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Name validation: ONLY letters
    const nameRegex = /^[a-zA-Z]+$/;
    if (!nameRegex.test(name)) {
      return res.status(400).json({ message: 'Name can only contain alphabetic letters (no spaces)' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// UPDATE USER PROFILE
router.put("/update", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update Name if provided
    if (req.body.name) {
      // Name validation: Only letters and spaces
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(req.body.name)) {
        return res
          .status(400)
          .json({ message: "Name can only contain letters and spaces" });
      }
      user.name = req.body.name;
    }

    // Update Password if provided
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    // Return the updated user info
    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
