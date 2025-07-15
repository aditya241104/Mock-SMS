import React from 'react';
import { Link } from 'react-router-dom';

const AuthLink = ({ text, linkText, to }) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-600">
        {text}{' '}
        <Link to={to} className="font-medium text-indigo-600 hover:text-indigo-500">
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthLink;