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
    <div className="p-5 card-dark rounded-lg border border-blue-900 shadow-md">
      <h2 className="text-lg font-medium text-blue-300 mb-3">Your shortened URL:</h2>
      <div className="flex">
        <input
          type="text"
          readOnly
          value={shortenedUrl}
          className="flex-grow input-dark rounded-l-md"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-blue-900 text-blue-200 border border-blue-700 rounded-r-md hover:bg-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="mt-3">
        <span className="text-sm text-gray-300">
          Original URL:{' '}
          <a href={originalUrl} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            {originalUrl.length > 50 ? `${originalUrl.substring(0, 50)}...` : originalUrl}
          </a>
        </span>
      </div>
    </div>
  );
};

export default ShortenedUrl;
