import React from 'react';
import { MessageSquare, Key, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, onApiKeyClick, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div 
      className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => navigate(`/project/${project._id}`)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500">{project.description || 'No description'}</p>
              <p className="text-xs text-gray-400 mt-1">
                Created {formatDate(project.createdAt)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApiKeyClick(project);
            }}
            className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            <Key className="w-4 h-4 mr-1" />
            API Keys
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(project._id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;