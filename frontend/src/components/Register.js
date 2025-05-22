import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="card-dark w-full max-w-md p-8 space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Register</h2>
        {error && <div className="bg-red-600 bg-opacity-20 text-red-300 p-2 rounded text-center">{error}</div>}
        {success && <div className="bg-green-700 bg-opacity-20 text-green-300 p-2 rounded text-center">Registration successful! Redirecting...</div>}
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input type="email" className="input-dark w-full p-3" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} className="input-dark w-full p-3 pr-10" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" tabIndex={-1} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Confirm Password</label>
          <input type={showPassword ? 'text' : 'password'} className="input-dark w-full p-3" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="button-dark w-full py-3 mt-2" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
        <div className="text-center mt-2">
          <a href="/login" className="text-blue-400 hover:underline">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
}
