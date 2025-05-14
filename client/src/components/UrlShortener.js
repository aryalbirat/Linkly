import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UrlShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copyText, setCopyText] = useState('Copy');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/shorten', { origUrl: originalUrl });
      setShortenedUrl(response.data.shortUrl);
      setShowResult(true);
      await fetchUrls(); // Refresh the URL list
    } catch (err) {
      console.error('Error shortening URL:', err);
      setError(err.response?.data?.error || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopyText('Copied!');
    setTimeout(() => setCopyText('Copy'), 2000);
  };

  const truncateText = (text, maxLength) => {
    if(text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="original-url" className="block text-sm font-medium text-gray-700 mb-1">
            Enter your long URL
          </label>
          <input
            type="url"
            id="original-url"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/very/long/url"
            required
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? 'Shortening...' : 'Shorten URL'}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {showResult && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <h5 className="font-medium text-gray-800">Your shortened URL:</h5>
          <div className="flex mt-2">
            <input
              type="text"
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none"
              value={shortenedUrl}
              readOnly
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-300"
            >
              {copyText}
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Original URL: <span>{originalUrl}</span>
          </div>
        </div>
      )}
      
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-800 mb-3">Recent URLs</h4>
        {recentUrls.length === 0 ? (
          <p className="text-gray-500">No URLs shortened yet</p>
        ) : (
          <div className="space-y-2">
            {recentUrls.map((url, index) => (
              <a
                key={index}
                href={url.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 border border-gray-200 rounded-md hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <h6 className="font-medium text-gray-800">{truncateText(url.origUrl, 40)}</h6>
                  <span className="text-sm text-gray-500">{url.clicks} click(s)</span>
                </div>
                <p className="text-blue-600 text-sm mt-1">{url.shortUrl}</p>
                <small className="text-gray-500">Created: {new Date(url.date).toLocaleString()}</small>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlShortener;
