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
  Archive,
  RotateCcw,
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
      case 'sent': return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      case 'delivered': return 'text-blue-800 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-800 bg-red-50 border-red-200';
      case 'queued': return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'received': return 'text-violet-800 bg-violet-50 border-violet-200';
      default: return 'text-slate-800 bg-slate-50 border-slate-200';
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
    if (diffDays <= 7) return `${diffDays}d ago`;
    
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
    return <MessageSquare className="w-4 h-4 text-slate-600" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-200 mb-4">
            <Loader className="w-8 h-8 animate-spin text-slate-600" />
          </div>
          <p className="text-slate-600 text-lg font-medium">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Messages</h1>
                  <p className="text-sm text-slate-500">
                    {filteredMessages.length} total
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={fetchMessages}
                disabled={loading}
                className="inline-flex items-center px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <RotateCcw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              
              {selectedMessages.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete {selectedMessages.length}
                </button>
              )}
              
              {messages.length > 0 && (
                <button
                  onClick={handleClearAllMessages}
                  disabled={clearingAll}
                  className="inline-flex items-center px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {clearingAll ? (
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Archive className="w-4 h-4 mr-2" />
                  )}
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search messages or numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none px-4 py-2.5 pr-8 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700 font-medium"
                  >
                    <option value="all">All messages</option>
                    <option value="sent">Sent</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                    <option value="queued">Queued</option>
                    <option value="received">Received</option>
                  </select>
                  <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-800">Something went wrong</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
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