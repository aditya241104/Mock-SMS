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
    trim: true
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
    default: Date.now
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
