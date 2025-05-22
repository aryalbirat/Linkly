// Component for URL input form
import React, { useState } from 'react';

const UrlForm = ({ onSubmit, loading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url) {
      onSubmit(url);
      setUrl('');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="original-url" className="block text-sm font-medium text-gray-300 mb-2">
          Enter your long URL
        </label>
        <input
          type="url"
          id="original-url"
          className="input-dark w-full px-4 py-3"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className={`button-dark w-full py-3 px-4 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Shortening...
          </span>
        ) : 'Shorten URL'}
      </button>
    </form>
  );
};

export default UrlForm;
