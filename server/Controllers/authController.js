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
    { id: user._id, version: user.tokenVersion },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};

// Set refresh token cookie
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Adjust for cross-site in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth/refresh-token',
    domain: process.env.COOKIE_DOMAIN || undefined // Set this in production
  });
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create user with tokenVersion for refresh token rotation
    const user = new User({ 
      username, 
      email, 
      password,
      tokenVersion: 0 
    });
    
    // Generate tokens
    const token = generateAuthToken(user);
    const refreshToken = generateRefreshToken(user);
    
    // Save refresh token to user and increment tokenVersion
    user.tokenVersion += 1;
    await user.save();

    // Set refresh token in cookie
    setRefreshTokenCookie(res, refreshToken);

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
      defaultApiKey: apiKey.key
    });
  } catch (error) {
    console.error('Registration error:', error);
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
    
    // Save refresh token to user and increment tokenVersion
    user.tokenVersion += 1;
    await user.save();

    // Set refresh token in cookie
    setRefreshTokenCookie(res, refreshToken);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user || user.tokenVersion !== decoded.version) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Generate new tokens
    const token = generateAuthToken(user);
    const newRefreshToken = generateRefreshToken(user);
    
    // Update token version and save
    user.tokenVersion += 1;
    await user.save();

    // Set new refresh token in cookie
    setRefreshTokenCookie(res, newRefreshToken);

    res.json({
      token
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const user = req.user;

    // Increment token version to invalidate all refresh tokens
    user.tokenVersion += 1;
    await user.save();

    // Clear refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth/refresh-token'
    });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
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