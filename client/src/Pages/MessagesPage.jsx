import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Phone, 
  Clock, 
  Trash2, 
  Eye, 
  X, 
  AlertCircle,
  Send,
  MessageCircle,
  PhoneCall,
  Calendar,
  CheckCircle,
  XCircle,
  Loader,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  User,
  Smartphone,
  Hash,
  ArrowRight,
  ArrowLeft,
  Download,
} from 'lucide-react';
import ApiService from '../services/ApiService';
import MessageList from '../components/MessagePage/MessageList';
import MessageDetailModal from '../components/MessagePage/MessageDetailModal';
import EmptyState from '../components/MessagePage/EmptyState';

const MessagesPage = () => {
  const { projectId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [clearingAll, setClearingAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchMessages();
    }
  }, [projectId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ApiService.getMessages(projectId);
      setMessages(response.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setDeletingMessageId(messageId);
      await ApiService.deleteMessageByid(messageId);
      setMessages(prev => prev.filter(msg => msg._id !== messageId));
      setSelectedMessages(prev => prev.filter(id => id !== messageId));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete message');
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleClearAllMessages = async () => {
    try {
      setClearingAll(true);
      await ApiService.deleteMessages(projectId);
      setMessages([]);
      setSelectedMessages([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to clear all messages');
    } finally {
      setClearingAll(false);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedMessages.map(id => ApiService.deleteMessageByid(id)));
      setMessages(prev => prev.filter(msg => !selectedMessages.includes(msg._id)));
      setSelectedMessages([]);
    } catch (err) {
      setError('Failed to delete selected messages');
    }
  };

  const openMessageModal = (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsModalOpen(false);
    setSelectedMessage(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent': return 'text-green-700 bg-green-100 border-green-200';
      case 'delivered': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'failed': return 'text-red-700 bg-red-100 border-red-200';
      case 'queued': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'received': return 'text-purple-700 bg-purple-100 border-purple-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <Send className="w-3 h-3" />;
      case 'delivered': return <CheckCircle className="w-3 h-3" />;
      case 'failed': return <XCircle className="w-3 h-3" />;
      case 'queued': return <Clock className="w-3 h-3" />;
      case 'received': return <MessageCircle className="w-3 h-3" />;
      default: return <MessageSquare className="w-3 h-3" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateMessage = (text, maxLength = 80) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.from.includes(searchTerm) ||
                         message.to.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || message.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleSelectMessage = (messageId) => {
    setSelectedMessages(prev => 
      prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  const getDirectionIcon = (direction) => {
    return direction === 'inbound' ? (
      <ArrowLeft className="w-4 h-4 text-blue-600" />
    ) : (
      <ArrowRight className="w-4 h-4 text-green-600" />
    );
  };

  const getMessageTypeIcon = (message) => {
    if (message.metadata?.isOTP) {
      return <Hash className="w-4 h-4 text-orange-600" />;
    }
    return <MessageSquare className="w-4 h-4 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <p className="text-gray-600 text-lg">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">SMS Inbox</h1>
                  <p className="text-sm text-gray-500">
                    {filteredMessages.length} message{filteredMessages.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchMessages}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              {selectedMessages.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected ({selectedMessages.length})
                </button>
              )}
              
              {messages.length > 0 && (
                <button
                  onClick={handleClearAllMessages}
                  disabled={clearingAll}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  {clearingAll ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4 mr-2" />
                  )}
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search messages, phone numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                  <option value="queued">Queued</option>
                  <option value="received">Received</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <span className="text-red-800">{error}</span>
            </div>
          </div>
        )}

        {/* Messages List */}
        {filteredMessages.length === 0 ? (
          <EmptyState searchTerm={searchTerm} filterStatus={filterStatus} />
        ) : (
          <MessageList
            messages={filteredMessages}
            selectedMessages={selectedMessages}
            handleSelectMessage={handleSelectMessage}
            openMessageModal={openMessageModal}
            handleDeleteMessage={handleDeleteMessage}
            deletingMessageId={deletingMessageId}
            getMessageTypeIcon={getMessageTypeIcon}
            getDirectionIcon={getDirectionIcon}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            formatTime={formatTime}
            formatDate={formatDate}
            truncateMessage={truncateMessage}
          />
        )}

        {/* Message Detail Modal */}
        {isModalOpen && (
          <MessageDetailModal
            selectedMessage={selectedMessage}
            closeMessageModal={closeMessageModal}
            handleDeleteMessage={handleDeleteMessage}
            getMessageTypeIcon={getMessageTypeIcon}
            getDirectionIcon={getDirectionIcon}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
          />
        )}
      </div>
    </div>
  );
};

export default MessagesPage;