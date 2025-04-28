import React, { useState } from 'react';

const ShortenedUrl = ({ shortenedUrl, originalUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-5 p-4 bg-green-50 rounded-md border border-green-200">
      <h2 className="text-lg font-medium text-gray-800 mb-2">Your shortened URL:</h2>
      <div className="flex">
        <input
          type="text"
          readOnly
          value={shortenedUrl}
          className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none"
        />
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-md hover:bg-gray-300 focus:outline-none"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="mt-2">
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
