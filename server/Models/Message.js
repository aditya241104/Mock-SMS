import mongoose from 'mongoose';
import { isValidIndianMobile } from '../utils/phoneValidator.js';

const messageSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  from: {
    type: String,
    required: true,
    trim: true
  },
  to: {
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

  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1600
  },
  direction: {
    type: String,
    enum: ['inbound', 'outbound'],
    required: true
  },
  status: {
    type: String,
    enum: ['queued', 'sent', 'delivered', 'failed', 'received'],
    default: 'queued'
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: { expires: '24h' } // Auto-delete after 24 hours
  },
  deliveredAt: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
});

messageSchema.index({ project: 1, createdAt: -1 });
export default mongoose.model('Message', messageSchema);