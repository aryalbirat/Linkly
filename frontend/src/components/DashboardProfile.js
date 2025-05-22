import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  // For demo, show name, email, and role
  return (
    <div className="card-dark p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-300">Profile</h2>
      {user?.name && <div className="mb-2"><span className="text-gray-400">Name:</span> <span className="font-mono text-gray-100">{user.name}</span></div>}
      <div className="mb-2"><span className="text-gray-400">Email:</span> <span className="font-mono text-gray-100">{user?.email}</span></div>
      <div className="mb-2"><span className="text-gray-400">Role:</span> <span className="font-mono text-gray-100">{user?.role}</span></div>
      {/* Add edit form here if you want to allow editing */}
    </div>
  );
}
