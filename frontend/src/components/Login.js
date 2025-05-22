import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="card-dark w-full max-w-md p-8 space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Login</h2>
        {error && <div className="bg-red-600 bg-opacity-20 text-red-300 p-2 rounded text-center">{error}</div>}
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input type="email" className="input-dark w-full p-3" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input type="password" className="input-dark w-full p-3" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="button-dark w-full py-3 mt-2" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        <div className="text-center mt-2">
          <a href="/register" className="text-blue-400 hover:underline">Don't have an account? Register</a>
        </div>
      </form>
    </div>
  );
}
