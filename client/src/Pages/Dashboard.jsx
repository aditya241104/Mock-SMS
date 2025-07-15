// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Key, MessageSquare, Activity } from 'lucide-react';
import ApiService from '../services/ApiService';
import ProjectCard from '../components/Dashboard/ProjectCard';
import NewProjectModal from '../components/Dashboard/NewProjectModal';
import ApiKeyModal from '../components/Dashboard/ApiKeyModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [apiKeys, setApiKeys] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newApiKey, setNewApiKey] = useState({ name: '' });
  const [visibleKeys, setVisibleKeys] = useState({});
  const handleCardClick = (projectId) => {
    navigate(`/project/${projectId}`);
    console.log("hey ")
  };
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUserproject();
      setProjects(response || []);
    } catch (err) {
      setError('Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchApiKeys = async (projectId) => {
    try {
      const response = await ApiService.getProjectApiKeys(projectId);
      setApiKeys(response || []);
    } catch (err) {
      console.error('Error fetching API keys:', err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createProject(newProject.name, newProject.description);
      setNewProject({ name: '', description: '' });
      setShowNewProjectModal(false);
      fetchProjects();
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await ApiService.deleteProject(projectId);
        fetchProjects();
      } catch (err) {
        console.error('Error deleting project:', err);
      }
    }
  };

  const handleCreateApiKey = async (e) => {
    e.preventDefault();
    try {
      await ApiService.createApiKey(selectedProject._id, newApiKey.name);
      setNewApiKey({ name: '' });
      setShowApiKeyModal(false);
      fetchApiKeys(selectedProject._id);
    } catch (err) {
      console.error('Error creating API key:', err);
    }
  };

  const handleDeleteApiKey = async (keyId) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      try {
        await ApiService.deleteApiKey(keyId);
        fetchApiKeys(selectedProject._id);
      } catch (err) {
        console.error('Error deleting API key:', err);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const openApiKeyModal = (project) => {
    setSelectedProject(project);
    setShowApiKeyModal(true);
    fetchApiKeys(project._id);
    console.log("hey");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">MockSMS</h1>
          <p className="text-gray-600">Manage your SMS testing projects</p>
        </div>

        {/* Stats Card - Only showing total projects */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{projects.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </button>
            </div>
          </div>

          {projects.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-500 mb-4">Create your first project to start testing SMS functionality</p>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </button>
            </div>
          ) : (
                <div className="divide-y divide-gray-200">
                  {projects.map((project) => (
                    <div
                      key={project._id}
                      onClick={() => handleCardClick(project._id)}
                      className="cursor-pointer"
                    >
                      <ProjectCard
                        project={project}
                        onApiKeyClick={(e) => {

                          openApiKeyModal(project);
                        }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          handleDeleteProject(project);
                        }}
                      />
                    </div>
                  ))}
                </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showNewProjectModal && (
        <NewProjectModal
          newProject={newProject}
          setNewProject={setNewProject}
          onCreateProject={handleCreateProject}
          onClose={() => setShowNewProjectModal(false)}
        />
      )}

      {showApiKeyModal && selectedProject && (
        <ApiKeyModal
          project={selectedProject}
          apiKeys={apiKeys}
          newApiKey={newApiKey}
          setNewApiKey={setNewApiKey}
          onCreateApiKey={handleCreateApiKey}
          onDeleteApiKey={handleDeleteApiKey}
          onClose={() => setShowApiKeyModal(false)}
          visibleKeys={visibleKeys}
          toggleKeyVisibility={toggleKeyVisibility}
          copyToClipboard={copyToClipboard}
        />
      )}
    </div>
  );
};

export default Dashboard;