import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyState = ({ searchTerm, filterStatus }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <MessageSquare className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {searchTerm || filterStatus !== 'all' ? 'No messages found' : 'No messages yet'}
      </h3>
      <p className="text-gray-500">
        {searchTerm || filterStatus !== 'all' 
          ? 'Try adjusting your search or filter criteria'
          : 'SMS messages will appear here when your application sends them'
        }
      </p>
    </div>
  );
};

export default EmptyState;