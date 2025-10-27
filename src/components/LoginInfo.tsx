import React from 'react';

export const LoginInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Access</h3>
      <p className="text-blue-800 mb-3">Use these credentials to access the admin panel:</p>
      <div className="bg-white rounded p-3 font-mono text-sm">
        <div className="mb-1">
          <span className="text-gray-600">Username:</span> <strong>admin</strong>
        </div>
        <div>
          <span className="text-gray-600">Password:</span> <strong>admin123</strong>
        </div>
      </div>
      <p className="text-xs text-blue-600 mt-2">
        Note: These are default credentials. In production, use environment variables to set secure credentials.
      </p>
    </div>
  );
};