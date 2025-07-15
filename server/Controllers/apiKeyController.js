import ApiKey from '../Models/ApiKey.js';
import Project from '../Models/Project.js';
import crypto from 'crypto';

// Helper function to generate API key
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const createApiKey = async (req, res) => {
  try {
    const { name } = req.body;

    // Verify the project belongs to the user
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const apiKey = new ApiKey({
      key: generateApiKey(),
      project: project._id,
      name: name || 'New API Key'
    });
    await apiKey.save();

    res.status(201).json(apiKey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProjectApiKeys = async (req, res) => {
  try {
    // Verify the project belongs to the user
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const apiKeys = await ApiKey.find({ project: project._id });
    res.json(apiKeys);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateApiKey = async (req, res) => {
  try {
    const { name, isActive } = req.body;

    // First find the API key
    const apiKey = await ApiKey.findById(req.params.id).populate('project');
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Verify the associated project belongs to the user
    if (apiKey.project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    apiKey.name = name || apiKey.name;
    apiKey.isActive = isActive !== undefined ? isActive : apiKey.isActive;
    await apiKey.save();

    res.json(apiKey);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteApiKey = async (req, res) => {
  try {
    // First find the API key
    const apiKey = await ApiKey.findById(req.params.id).populate('project');
    if (!apiKey) {
      return res.status(404).json({ error: 'API key not found' });
    }

    // Verify the associated project belongs to the user
    if (apiKey.project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await apiKey.deleteOne();
    res.json({ message: 'API key deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};