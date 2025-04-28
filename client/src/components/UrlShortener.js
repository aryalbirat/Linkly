import React, { useState, useEffect } from 'react';
import UrlForm from './UrlForm';
import ShortenedUrl from './ShortenedUrl';
import UrlList from './UrlList';
import axios from 'axios';

const UrlShortener = () => {
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [originalUrl, setOriginalUrl] = useState('');
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all URLs when component mounts
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const response = await axios.get('/api/all');
      // Sort by date (newest first)
      const sortedUrls = response.data.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      );
      setRecentUrls(sortedUrls.slice(0, 5));
    } catch (err) {
      console.error('Error fetching URLs:', err);
      setError('Failed to load recent URLs');
    }
  };

  const handleShortenUrl = async (url) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/shorten', { origUrl: url });
      setShortenedUrl(response.data.shortUrl);
      setOriginalUrl(response.data.origUrl);
      await fetchUrls(); // Refresh the URL list
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">URL Shortener</h1>
        
        <UrlForm onSubmit={handleShortenUrl} loading={loading} />
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {shortenedUrl && (
          <ShortenedUrl shortenedUrl={shortenedUrl} originalUrl={originalUrl} />
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <UrlList urls={recentUrls} />
      </div>
    </div>
  );
};

export default UrlShortener;
