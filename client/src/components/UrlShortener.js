// Main component that orchestrates URL shortening functionality
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Import child components
import UrlForm from './UrlForm';
import ShortenedUrl from './ShortenedUrl';
import UrlList from './UrlList';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
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
      );      setRecentUrls(sortedUrls.slice(0, 5));
    } catch (err) {
      console.error('Error fetching URLs:', err);
      setError('Unable to load recent URLs. Please refresh the page to try again.');
    }
  };

  const handleSubmit = async (url) => {
    setLoading(true);
    setError(null);
    setOriginalUrl(url);
    
    try {
      const response = await axios.post('/api/shorten', { origUrl: url });
      setShortenedUrl(response.data.shortUrl);
      setShowResult(true);
      await      fetchUrls(); // Refresh the URL list
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError(err.response?.data?.error || 'Unable to shorten URL. Please try again with a valid URL.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-8">
      <UrlForm 
        onSubmit={handleSubmit} 
        loading={loading} 
      />
      
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}
      
      {showResult && (
        <ShortenedUrl 
          shortenedUrl={shortenedUrl} 
          originalUrl={originalUrl} 
        />
      )}
      
      <UrlList urls={recentUrls} />
    </div>
  );
};

export default UrlShortener;
