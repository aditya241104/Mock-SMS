import React from 'react';
import { Clock, Send, CheckCircle, XCircle, MessageCircle, MessageSquare, ArrowLeft, ArrowRight, Hash, Smartphone, Eye, Trash2, Loader } from 'lucide-react';

const MessageList = ({ 
  messages, 
  selectedMessages, 
  handleSelectMessage, 
  openMessageModal, 
  handleDeleteMessage, 
  deletingMessageId,
  getMessageTypeIcon,
  getDirectionIcon,
  getStatusColor,
  getStatusIcon,
  formatTime,
  formatDate,
  truncateMessage
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="divide-y divide-gray-100">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`relative flex items-center p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
              selectedMessages.includes(message._id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => openMessageModal(message)}
          >
            {/* Selection Checkbox */}
            <div className="flex items-center mr-3">
              <input
                type="checkbox"
                checked={selectedMessages.includes(message._id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectMessage(message._id);
                }}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </div>

            {/* Message Type Icon */}
            <div className="flex-shrink-0 mr-3">
              {getMessageTypeIcon(message)}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-sm">
                    <Smartphone className="w-3 h-3 text-gray-400" />
                    <span className="font-medium text-gray-900">{message.from}</span>
                    {getDirectionIcon(message.direction)}
                    <span className="font-medium text-gray-900">{message.to}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(message.status)}`}>
                    {getStatusIcon(message.status)}
                    <span className="ml-1 capitalize">{message.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-800 truncate pr-2">{truncateMessage(message.body)}</p>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <span>{formatDate(message.createdAt)}</span>
                  {message.metadata?.isOTP && (
                    <span className="ml-2 bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      OTP
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMessageModal(message);
                }}
                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMessage(message._id);
                }}
                disabled={deletingMessageId === message._id}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
              >
                {deletingMessageId === message._id ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MessageList;