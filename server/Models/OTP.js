import mongoose from 'mongoose';
import { isValidIndianMobile } from '../utils/phoneValidator.js';

const otpSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return isValidIndianMobile(v);
      },
      message: props => `${props.value} is not a valid Indian mobile number!`
    }
  },
  code: {
    type: String,
    required: true,
    trim: true
  },
  purpose: {
    type: String,
    trim: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
otpSchema.index({ project: 1, phone: 1, createdAt: -1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model('OTP', otpSchema);