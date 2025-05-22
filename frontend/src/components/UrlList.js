// Component for displaying the list of recently shortened URLs
import React from 'react';

const UrlList = ({ urls }) => {
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };
  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-blue-200 mb-4 border-b border-gray-700 pb-2">Recent URLs</h2>
      {urls.length === 0 ? (
        <p className="text-gray-400">No URLs shortened yet</p>
      ) : (
        <div className="space-y-3">
          {urls.map((url, index) => (
            <a
              key={url._id || index}
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 card-dark hover:bg-gray-700 transition-colors duration-150 hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-100">
                  {truncateText(url.origUrl, 40)}
                </h3>
                <span className="text-sm bg-blue-900 text-blue-200 py-1 px-2 rounded-md">
                  {url.clicks} click{url.clicks !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-blue-400 mt-1 font-medium">{url.shortUrl}</p>
              <span className="text-xs text-gray-400 mt-2 block">
                Created: {formatDate(url.date)}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default UrlList;
