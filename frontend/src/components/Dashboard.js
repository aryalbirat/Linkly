import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Linkly from './UrlShortener';
import DashboardProfile from './DashboardProfile';
import { apiClient } from '../contexts/AuthContext';

const tabs = [
  { name: 'Shorten URL', key: 'shorten' },
  { name: 'Analytics', key: 'analytics' },
  { name: 'Profile', key: 'profile' }
];

function DashboardAnalytics() {
  const { token, user } = useAuth();
  const [stats, setStats] = useState(null);
  const [urlData, setUrlData] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    
    // Create headers with auth token
    const headers = { Authorization: `Bearer ${token}` };
    
    // Fetch user's URLs
    const fetchUrls = apiClient.get('/api/my', { headers });
    
    // Fetch clicks over time data
    const fetchTimeData = apiClient.get('/api/clicks-over-time', { headers });
    
    // Use Promise.all to fetch both data sources simultaneously
    Promise.all([fetchUrls, fetchTimeData])
      .then(([urlsResponse, timeResponse]) => {
        const urls = urlsResponse.data;
        
        // Calculate basic stats
        setStats({
          urlCount: urls.length,
          totalClicks: urls.reduce((sum, u) => sum + (u.clicks || 0), 0)
        });
        
        // Sort URLs by clicks for the chart
        const sortedUrls = [...urls].sort((a, b) => b.clicks - a.clicks);
        setUrlData(sortedUrls.slice(0, 5)); // Top 5 URLs by clicks
        
        // Set time series data
        setTimeData(timeResponse.data);
      })
      .catch(err => {
        console.error('Error fetching analytics data:', err);
        setError('Failed to load analytics data. Please try again later.');
        setStats(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  // Function to render a simple bar chart
  const renderBarChart = () => {
    if (!urlData || urlData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg className="w-12 h-12 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
          <p>No URL data available yet</p>
          <p className="text-sm mt-2">Shorten some URLs to see analytics</p>
        </div>
      );
    }
    
    const maxClicks = Math.max(...urlData.map(url => url.clicks || 0));
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">Top URLs by Clicks</h3>
        <div className="space-y-4">
          {urlData.map((url, index) => {
            const percentage = maxClicks > 0 ? (url.clicks || 0) / maxClicks * 100 : 0;
            let shortUrl = '';
            try {
              shortUrl = new URL(url.shortUrl).pathname.substring(1); // Extract the short code
            } catch (e) {
              shortUrl = url.urlId || 'unknown';
            }
            
            return (
              <div key={url._id || index} className="relative">
                <div className="flex items-center mb-1">
                  <span className="text-sm font-medium text-gray-300 w-16">{shortUrl}</span>
                  <span className="ml-2 text-blue-400 font-bold">{url.clicks || 0}</span>
                </div>
                <div className="h-6 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate" title={url.origUrl}>
                  {url.origUrl}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Function to render a simple line chart (clicks over time)
  const renderClicksOverTime = () => {
    if (!timeData || timeData.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg className="w-12 h-12 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
          <p>No time series data available yet</p>
          <p className="text-sm mt-2">Check back after your URLs get more clicks</p>
        </div>
      );
    }
    
    const maxClicks = Math.max(...timeData.map(item => item.clicks || 0));
    const chartHeight = 200;
    
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-blue-300 mb-4">Clicks Over Time (Last 7 Days)</h3>
        <div className="bg-gray-800 rounded-lg p-6 h-80">
          {/* Chart container */}
          <div className="relative h-64">
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between text-xs text-gray-400">
              <div>{maxClicks}</div>
              <div>{Math.floor(maxClicks / 2)}</div>
              <div>0</div>
            </div>
            
            {/* Chart area */}
            <div className="absolute left-12 right-0 top-0 bottom-0 flex items-end">
              {timeData.map((item, index) => {
                const height = maxClicks > 0 ? (item.clicks / maxClicks) * chartHeight : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    {/* Bar */}
                    <div 
                      className="w-4/5 bg-blue-600 rounded-t-sm transition-all duration-500 ease-in-out" 
                      style={{ height: `${height}px` }}
                      title={`${item.clicks} clicks on ${item.date}`}
                    ></div>
                    {/* X-axis label */}
                    <div className="text-xs text-gray-400 mt-2">
                      {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short' })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card-dark p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-blue-300">My Analytics</h2>
      
      {error && (
        <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 p-4 rounded-lg mb-6">
          <p className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
            {error}
          </p>
        </div>
      )}
      
      {loading ? (
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="h-32 bg-gray-700 rounded-lg"></div>
            <div className="h-32 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-lg text-center transform transition-transform hover:scale-105">
              <span className="text-5xl font-bold text-blue-400 block mb-2">{stats.urlCount}</span>
              <span className="text-gray-300">Shortened URLs</span>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg text-center transform transition-transform hover:scale-105">
              <span className="text-5xl font-bold text-blue-400 block mb-2">{stats.totalClicks}</span>
              <span className="text-gray-300">Total Clicks</span>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2 md:mb-0">Performance Charts</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setChartType('bar')}
                  className={`px-4 py-2 rounded text-sm transition-colors ${chartType === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Top URLs
                </button>
                <button 
                  onClick={() => setChartType('line')}
                  className={`px-4 py-2 rounded text-sm transition-colors ${chartType === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                >
                  Clicks Over Time
                </button>
              </div>
            </div>
            
            <div className="bg-gray-900 bg-opacity-50 rounded-lg p-4">
              {chartType === 'bar' ? renderBarChart() : renderClicksOverTime()}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-xl text-gray-400">No analytics data available</p>
          <p className="text-gray-500 mt-2">Try shortening some URLs first</p>
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('shorten');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <aside className="sidebar-dark w-full md:w-56 flex flex-col py-4 md:py-8 px-4 md:min-h-screen bg-gray-900">
        <div className="mb-6 text-2xl font-bold text-blue-400">Dashboard</div>
        <nav className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-visible">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`px-4 py-2 rounded transition font-semibold whitespace-nowrap ${activeTab === tab.key ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-800'}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout} className="mt-auto button-dark w-full py-2 md:mt-8">Logout</button>
      </aside>
      <main className="flex-1 flex flex-col p-4 md:p-8 bg-gray-900 min-h-screen">
        <div className="w-full mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-400 mb-2">Welcome to Linkly</h1>
          <p className="text-gray-300">Your one-stop solution for shortening URLs and tracking analytics</p>
        </div>
        
        {activeTab === 'shorten' && <Linkly />}
        {activeTab === 'analytics' && <DashboardAnalytics />}
        {activeTab === 'profile' && <DashboardProfile />}
      </main>
    </div>
  );
}
