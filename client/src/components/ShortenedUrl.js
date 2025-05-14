// Component for displaying the shortened URL with copy feature
import React, { useState } from 'react';

const ShortenedUrl = ({ shortenedUrl, originalUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="p-5 bg-green-50 rounded-lg border border-green-200 shadow-sm">
      <h2 className="text-lg font-medium text-gray-800 mb-3">Your shortened URL:</h2>
      <div className="flex">
        <input
          type="text"
          readOnly
          value={shortenedUrl}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-100 text-blue-700 border border-blue-300 rounded-r-md hover:bg-blue-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>      <div className="mt-3">
        <span className="text-sm text-gray-600">
          Original URL:{' '}
          <a href={originalUrl} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {originalUrl.length > 50 ? `${originalUrl.substring(0, 50)}...` : originalUrl}
          </a>
        </span>
      </div>
    </div>
  );
};

export default ShortenedUrl;
