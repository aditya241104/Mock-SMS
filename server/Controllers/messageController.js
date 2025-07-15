import Message from '../Models/Message.js';
import OTP from '../Models/OTP.js';
import Project from '../Models/Project.js';
import ApiKey from '../Models/ApiKey.js';
import mongoose from 'mongoose';

// Send a message (API key authenticated)
export const sendMessage = async (req, res) => {
  try {
    const { from, to, body, metadata } = req.body;

    if (!from || !to || !body) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const message = new Message({
      project: req.project._id,
      from,
      to,
      body,
      direction: 'outbound',
      status: 'sent',
      metadata
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'Message logged successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Send OTP (API key authenticated)
export const sendOTP = async (req, res) => {
  try {
    const { phone, purpose } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    // Generate a random 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    const otp = new OTP({
      project: req.project._id,
      phone,
      code,
      purpose,
      expiresAt
    });

    await otp.save();

    const message = new Message({
      project: req.project._id,
      from: 'SYSTEM',
      to: phone,
      body: `Your OTP is ${code}` + (purpose ? ` for ${purpose}` : ''),
      direction: 'outbound',
      status: 'sent',
      metadata: { isOTP: true, otpId: otp._id }
    });

    await message.save();

    res.status(201).json({
      success: true,
      message: 'OTP generated and logged',
      data: {
        otpId: otp._id,
        expiresAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify OTP (API key authenticated)
export const verifyOTP = async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).json({ error: 'Phone and code are required' });
    }

    const otp = await OTP.findOne({
      project: req.project._id,
      phone,
      code,
      expiresAt: { $gt: new Date() },
      verified: false
    });

    if (!otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    otp.verified = true;
    await otp.save();

    res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages for a project (user authenticated)
export const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Verify the user owns this project
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    const messages = await Message.find({ project: projectId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ error: 'Invalid message ID' });
    }

    // First find the message to verify project ownership
    const message = await Message.findById(messageId).populate('project');
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Verify the user owns the project this message belongs to
    const project = await Project.findOne({
      _id: message.project._id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await Message.deleteOne({ _id: messageId });

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all messages for a project
export const deleteProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    // Verify the user owns this project
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found or access denied' });
    }

    const result = await Message.deleteMany({ project: projectId });

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} messages`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};