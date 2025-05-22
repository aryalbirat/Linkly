import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import UrlForm from './UrlForm';
import ShortenedUrl from './ShortenedUrl';
import UrlList from './UrlList';

const UrlShortener = () => {
  const { token } = useAuth();
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get('/api/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const sortedUrls = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentUrls(sortedUrls.slice(0, 5));
      })
      .catch(() => setRecentUrls([]))
      .finally(() => setLoading(false));
  }, [token]);

  const fetchUrls = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get('/api/my', { headers: { Authorization: `Bearer ${token}` } });
      const sortedUrls = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setRecentUrls(sortedUrls.slice(0, 5));
    } catch {
      setRecentUrls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (url) => {
    setLoading(true);
    setError(null);
    setOriginalUrl(url);
    try {
      const response = await axios.post('/api/shorten', { origUrl: url }, { headers: { Authorization: `Bearer ${token}` } });
      setShortenedUrl(response.data.shortUrl);
      setShowResult(true);
      await fetchUrls();
    } catch (err) {
      setError(err.response?.data?.error || 'Unable to shorten URL. Please try again with a valid URL.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <UrlForm onSubmit={handleSubmit} loading={loading} />
      {error && (
        <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      {showResult && (
        <ShortenedUrl shortenedUrl={shortenedUrl} originalUrl={originalUrl} />
      )}
      {loading ? <div className="animate-pulse h-8 bg-gray-800 rounded w-1/2 mx-auto" /> : <UrlList urls={recentUrls} />}
    </div>
  );
};

export default UrlShortener;
