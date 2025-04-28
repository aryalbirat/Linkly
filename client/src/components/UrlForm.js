import React, { useState } from 'react';

const UrlForm = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      onSubmit(url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="original-url" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your long URL
        </label>
        <input
          type="url"
          id="original-url"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
          loading ? 'opacity-75 cursor-not-allowed' : ''
        }`}
        disabled={loading}
      >
        {loading ? 'Shortening...' : 'Shorten URL'}
      </button>
    </form>
  );
};

export default UrlForm;
