import React from 'react';
import { Clock, Send, CheckCircle, XCircle, MessageCircle, MessageSquare, ArrowLeft, ArrowRight, Hash, Smartphone, Eye, Trash2, Loader, User } from 'lucide-react';

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="divide-y divide-slate-100">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`relative group flex items-center p-5 hover:bg-slate-50 transition-all duration-150 cursor-pointer ${
              selectedMessages.includes(message._id) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => openMessageModal(message)}
          >
            {/* Selection Checkbox */}
            <div className="flex items-center mr-4">
              <input
                type="checkbox"
                checked={selectedMessages.includes(message._id)}
                onChange={(e) => {
                  e.stopPropagation();
                  handleSelectMessage(message._id);
                }}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
              />
            </div>

            {/* Message Type & Direction Indicators */}
            <div className="flex-shrink-0 mr-4">
              <div className="relative">
                {getMessageTypeIcon(message)}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                  {message.direction === 'inbound' ? (
                    <ArrowLeft className="w-2 h-2 text-blue-600" />
                  ) : (
                    <ArrowRight className="w-2 h-2 text-green-600" />
                  )}
                </div>
              </div>
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-600" />
                    </div>
                    <span className="font-semibold text-slate-900">{message.from}</span>
                    <span className="text-slate-400">→</span>
                    <span className="font-semibold text-slate-900">{message.to}</span>
                  </div>
                  {message.metadata?.isOTP && (
                    <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">
                      <Hash className="w-3 h-3 mr-1" />
                      OTP
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-slate-500 font-medium">{formatTime(message.createdAt)}</span>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(message.status)}`}>
                    {getStatusIcon(message.status)}
                    <span className="ml-1.5 capitalize">{message.status}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700 truncate pr-4 leading-relaxed">{truncateMessage(message.body)}</p>
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <span className="whitespace-nowrap">{formatDate(message.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openMessageModal(message);
                }}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="View details"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMessage(message._id);
                }}
                disabled={deletingMessageId === message._id}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Delete message"
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