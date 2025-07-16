import React from 'react';
import { X, User, CheckCircle, Hash, Calendar, MessageSquare, Clock, Copy } from 'lucide-react';

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-200">
                {getMessageTypeIcon(selectedMessage)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Message Details</h2>
                <p className="text-sm text-slate-500 mt-1">
                  {new Date(selectedMessage.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {new Date(selectedMessage.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <button
              onClick={closeMessageModal}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-8">
            {/* Message Conversation View */}
            <div className="bg-slate-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="font-semibold text-slate-900">{selectedMessage.from}</span>
                    <div className="flex items-center space-x-1">
                      {getDirectionIcon(selectedMessage.direction)}
                    </div>
                    <span className="font-semibold text-slate-900">{selectedMessage.to}</span>
                  </div>
                </div>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(selectedMessage.status)}`}>
                  {getStatusIcon(selectedMessage.status)}
                  <span className="ml-1.5 capitalize">{selectedMessage.status}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                <p className="text-slate-900 whitespace-pre-wrap leading-relaxed text-base">
                  {selectedMessage.body}
                </p>
                <button
                  onClick={() => copyToClipboard(selectedMessage.body)}
                  className="mt-3 inline-flex items-center text-xs text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy message
                </button>
              </div>
            </div>

            {/* Message Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Message Info</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-600">Direction</span>
                      <div className="flex items-center space-x-2">
                        {getDirectionIcon(selectedMessage.direction)}
                        <span className="text-sm font-medium text-slate-900 capitalize">
                          {selectedMessage.direction}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-600">Created</span>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {new Date(selectedMessage.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-600">Time</span>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-900">
                          {new Date(selectedMessage.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Technical Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-600">Message ID</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-mono text-slate-900 bg-slate-100 px-2 py-1 rounded">
                          {selectedMessage._id.slice(-8)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(selectedMessage._id)}
                          className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    
                    {selectedMessage.deliveredAt && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">Delivered</span>
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-medium text-slate-900">
                            {new Date(selectedMessage.deliveredAt).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {selectedMessage.metadata?.isOTP && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-slate-600">Type</span>
                        <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                          <Hash className="w-3 h-3 mr-1" />
                          OTP Message
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Section */}
            {selectedMessage.metadata && Object.keys(selectedMessage.metadata).length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-3">Metadata</h4>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap overflow-x-auto font-mono">
                    {JSON.stringify(selectedMessage.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
          <div className="flex space-x-3">
            <button
              onClick={closeMessageModal}
              className="px-4 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={() => {
                handleDeleteMessage(selectedMessage._id);
                closeMessageModal();
              }}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors font-medium"
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