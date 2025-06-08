import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login, user, loading: authLoading, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/dashboard');
    }
  }, [user, authLoading, navigate]);

  // Set local error state when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      // user state will update and useEffect will redirect
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="card-dark w-full max-w-md p-8 space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Login</h2>
        {error && <div className="bg-red-600 bg-opacity-20 text-red-300 p-3 rounded text-center">{error}</div>}
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input type="email" className="input-dark w-full p-3" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input type="password" className="input-dark w-full p-3" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button 
          type="submit" 
          className="button-dark w-full py-3 mt-2 relative" 
          disabled={loading || authLoading}
        >
          {(loading || authLoading) && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
          <span className={loading || authLoading ? "opacity-0" : ""}>Login</span>
        </button>
        <div className="text-center mt-2">
          <a href="/register" className="text-blue-400 hover:underline">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
}
