// components/ApiKeyModal.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Trash2 } from 'lucide-react';

const ApiKeyModal = ({ 
  project, 
  apiKeys, 
  newApiKey, 
  setNewApiKey, 
  onCreateApiKey, 
  onDeleteApiKey, 
  onClose,
  visibleKeys,
  toggleKeyVisibility,
  copyToClipboard 
}) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            API Keys for {project.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onCreateApiKey} className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex space-x-3">
            <input
              type="text"
              value={newApiKey.name}
              onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
              placeholder="API Key Name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={50}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
          </div>
        </form>

        <div className="space-y-3">
          {apiKeys.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No API keys created yet</p>
          ) : (
            apiKeys.map((apiKey) => (
              <div key={apiKey._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{apiKey.name}</h4>
                    <div className="flex items-center mt-2">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {visibleKeys[apiKey._id] ? apiKey.key : '••••••••••••••••••••'}
                      </code>
                      <button
                        onClick={() => toggleKeyVisibility(apiKey._id)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        {visibleKeys[apiKey._id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Created {formatDate(apiKey.createdAt)}
                      {apiKey.lastUsed && ` • Last used ${formatDate(apiKey.lastUsed)}`}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      apiKey.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {apiKey.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => onDeleteApiKey(apiKey._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;