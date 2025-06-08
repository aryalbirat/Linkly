import React from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardProfile() {
  const { user } = useAuth();

  return (
    <div className="card-dark p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-300">Profile</h2>
      
      {!user ? (
        <div className="text-red-400">Loading user information...</div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center mb-6">
            <div className="bg-blue-700 text-blue-100 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-100">{user.name || 'User'}</h3>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-gray-700 pt-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Email:</span>
              <span className="font-medium text-gray-100">{user.email}</span>
            </div>
            {user.name && (
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="font-medium text-gray-100">{user.name}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-400">Role:</span>
              <span className="font-medium text-gray-100 capitalize">{user.role || 'user'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Account created:</span>
              <span className="font-medium text-gray-100">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
