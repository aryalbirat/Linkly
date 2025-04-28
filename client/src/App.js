import React from 'react';
import UrlShortener from './components/UrlShortener';

function App() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <UrlShortener />
      </div>
    </div>
  );
}

export default App;
