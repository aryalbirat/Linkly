import React from 'react';
import UrlShortener from './components/UrlShortener';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold">URL Shortener</h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6 text-center text-gray-800">Shorten Your URL</h2>
            <UrlShortener />
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} URL Shortener App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
