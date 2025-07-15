import User from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Project from '../Models/Project.js';
import ApiKey from '../Models/ApiKey.js';
import crypto from 'crypto';

// Helper function to generate API key
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate JWT token
const generateAuthToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create user
    const user = new User({ username, email, password });
    
    // Generate tokens
    const token = generateAuthToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    // Create a default project for the user
    const project = new Project({
      name: 'Default Project',
      description: 'Automatically created default project',
      owner: user._id
    });
    await project.save();

    // Generate an API key for the default project
    const apiKey = new ApiKey({
      key: generateApiKey(),
      project: project._id,
      name: 'Default API Key'
    });
    await apiKey.save();

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token,
      refreshToken,
      defaultApiKey: apiKey.key
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const token = generateAuthToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Save refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token,
      refreshToken
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const user = req.user;
    
    // Generate new tokens
    const token = generateAuthToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Save new refresh token to user
    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      token,
      refreshToken
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;
    
    // Remove refresh token
    user.refreshToken = undefined;
    await user.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email
    }
  });
};