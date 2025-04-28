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
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent URLs</h2>
      {urls.length === 0 ? (
        <p className="text-gray-500">No URLs shortened yet</p>
      ) : (
        <div className="space-y-3">
          {urls.map((url) => (
            <a
              key={url._id}
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-900">
                  {truncateText(url.origUrl, 40)}
                </h3>
                <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                  {url.clicks} click{url.clicks !== 1 ? 's' : ''}
                </span>
              </div>
              <p className="text-blue-600 mt-1">{url.shortUrl}</p>
              <span className="text-xs text-gray-500 mt-1 block">
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
