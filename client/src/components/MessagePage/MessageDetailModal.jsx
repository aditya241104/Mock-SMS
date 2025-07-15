import React from 'react';
import { X, User, CheckCircle, Hash, Calendar, MessageSquare } from 'lucide-react';

const MessageDetailModal = ({ 
  selectedMessage, 
  closeMessageModal, 
  handleDeleteMessage,
  getMessageTypeIcon,
  getDirectionIcon,
  getStatusColor,
  getStatusIcon
}) => {
  if (!selectedMessage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {getMessageTypeIcon(selectedMessage)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Message Details</h2>
                <p className="text-sm text-gray-500">
                  {new Date(selectedMessage.createdAt).toLocaleDateString()} at {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <button
              onClick={closeMessageModal}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Message Thread Style */}
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{selectedMessage.from}</span>
                  {getDirectionIcon(selectedMessage.direction)}
                  <span className="font-medium text-gray-900">{selectedMessage.to}</span>
                </div>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedMessage.status)}`}>
                  {getStatusIcon(selectedMessage.status)}
                  <span className="ml-1 capitalize">{selectedMessage.status}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.body}
                </p>
              </div>
            </div>

            {/* Message Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Direction</label>
                  <div className="flex items-center space-x-2">
                    {getDirectionIcon(selectedMessage.direction)}
                    <span className="text-gray-900 capitalize">{selectedMessage.direction}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Created</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900">{new Date(selectedMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message ID</label>
                  <div className="flex items-center space-x-2">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900 font-mono text-sm">{selectedMessage._id}</span>
                  </div>
                </div>
                
                {selectedMessage.deliveredAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivered</label>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-900">{new Date(selectedMessage.deliveredAt).toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Metadata Section */}
            {selectedMessage.metadata && Object.keys(selectedMessage.metadata).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Metadata</label>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <pre className="text-sm text-gray-900 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(selectedMessage.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <div className="flex space-x-3">
            <button
              onClick={closeMessageModal}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleDeleteMessage(selectedMessage._id);
                closeMessageModal();
              }}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
            >
              Delete Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;