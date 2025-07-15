import OTP from '../Models/OTP.js';
import Project from '../Models/Project.js';
import crypto from 'crypto';

export const sendOTP = async (req, res) => {
  try {
    const { phone, purpose = 'verification' } = req.body;
    
    // For API key authenticated requests
    const project = req.project || req.user.project;
    
    if (!project) {
      return res.status(400).json({ error: 'Project context required' });
    }

    // Generate a 6-digit code
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    const otp = new OTP({
      project: project._id,
      phone,
      code,
      purpose,
      expiresAt
    });

    await otp.save();

    // In a real application, you would send the OTP via SMS here
    // For development/testing, we'll return the code in the response
    res.status(201).json({
      otp: {
        id: otp._id,
        phone: otp.phone,
        purpose: otp.purpose,
        expiresAt: otp.expiresAt
      },
      // Only include code in development/test environment
      ...(process.env.NODE_ENV !== 'production' && { code: otp.code })
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, code } = req.body;
    
    // For API key authenticated requests
    const project = req.project || req.user.project;
    
    if (!project) {
      return res.status(400).json({ error: 'Project context required' });
    }

    const otp = await OTP.findOne({
      project: project._id,
      phone,
      code,
      expiresAt: { $gt: new Date() },
      verified: false
    });

    if (!otp) {
      return res.status(400).json({ error: 'Invalid OTP or expired' });
    }

    otp.verified = true;
    await otp.save();

    res.json({
      verified: true,
      phone: otp.phone,
      purpose: otp.purpose
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};