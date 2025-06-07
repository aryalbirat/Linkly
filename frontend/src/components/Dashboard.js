import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Linkly from './UrlShortener';
import DashboardProfile from './DashboardProfile';

const tabs = [
  { name: 'Shorten URL', key: 'shorten' },
  { name: 'Analytics', key: 'analytics' },
  { name: 'Profile', key: 'profile' }
];

function DashboardAnalytics() {
  const { token } = useAuth();
  const [stats, setStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch('/api/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(urls => {
        setStats({
          urlCount: urls.length,
          totalClicks: urls.reduce((sum, u) => sum + (u.clicks || 0), 0)
        });
      })
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="card-dark p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 text-blue-300">My Analytics</h2>
      {loading ? <div className="animate-pulse h-8 bg-gray-700 rounded w-1/2 mb-2" /> : stats ? (
        <div className="flex gap-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-400">{stats.urlCount}</span>
            <span className="text-gray-300">Shortened URLs</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-blue-400">{stats.totalClicks}</span>
            <span className="text-gray-300">Total Clicks</span>
          </div>
        </div>
      ) : <div className="text-red-400">Failed to load analytics.</div>}
    </div>
  );
}

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('shorten');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sidebar-dark w-56 flex flex-col py-8 px-4 min-h-screen">
        <div className="mb-8 text-2xl font-bold text-blue-400">Dashboard</div>
        <nav className="flex-1 space-y-2">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`w-full text-left px-4 py-2 rounded transition font-semibold ${activeTab === tab.key ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-8 button-dark w-full">Logout</button>
      </aside>
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-gray-900 min-h-screen">
        {activeTab === 'shorten' && <Linkly />}
        {activeTab === 'analytics' && <DashboardAnalytics />}
        {activeTab === 'profile' && <DashboardProfile />}
      </main>
    </div>
  );
}
