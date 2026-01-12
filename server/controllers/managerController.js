import Manager from "../models/Manager.js";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @route   POST /api/manager/login
export const loginManager = async (req, res) => {
  const { email, password } = req.body;

  try {
    const manager = await Manager.findOne({ email });

    if (!manager) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await manager.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: manager._id,
      email: manager.email,
      token: generateToken(manager._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route   POST /api/manager/create (optional – admin only)
export const createManager = async (req, res) => {
  const { email, password } = req.body;

  const managerExists = await Manager.findOne({ email });
  if (managerExists) {
    return res.status(400).json({ message: "Manager already exists" });
  }

  const manager = await Manager.create({ email, password });

  res.status(201).json({
    message: "Manager created successfully",
    managerId: manager._id,
  });
};
