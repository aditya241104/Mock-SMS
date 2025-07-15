import React from 'react';

const AuthForm = ({ children, error, onSubmit }) => {
  return (
    <form className="mt-8 space-y-6" onSubmit={onSubmit}>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {children}
      </div>
    </form>
  );
};

export default AuthForm;