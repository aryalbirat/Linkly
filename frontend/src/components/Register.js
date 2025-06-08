import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register, error: authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Set local error state when auth error changes
  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Form validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await register(email, password, name);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="card-dark w-full max-w-md p-8 space-y-6 shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center text-white">Register</h2>
        
        {error && (
          <div className="bg-red-600 bg-opacity-20 text-red-300 p-3 rounded text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-700 bg-opacity-20 text-green-300 p-3 rounded text-center">
            Registration successful! Redirecting...
          </div>
        )}
        
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input 
            type="email" 
            className="input-dark w-full p-3" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            autoFocus 
          />
        </div>
        
        <div>
          <label className="block mb-1 text-gray-300">Name (Optional)</label>
          <input 
            type="text" 
            className="input-dark w-full p-3" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
        </div>
        
        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              className="input-dark w-full p-3 pr-10" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            <button 
              type="button" 
              tabIndex={-1} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" 
              onClick={() => setShowPassword(v => !v)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>
        
        <div>
          <label className="block mb-1 text-gray-300">Confirm Password</label>
          <input 
            type={showPassword ? 'text' : 'password'} 
            className="input-dark w-full p-3" 
            value={confirmPassword} 
            onChange={e => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        
        <button 
          type="submit" 
          className="button-dark w-full py-3 mt-2 relative" 
          disabled={loading}
        >
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          )}
          <span className={loading ? "opacity-0" : ""}>Register</span>
        </button>
        
        <div className="text-center mt-2">
          <a href="/login" className="text-blue-400 hover:underline">Already have an account? Login</a>
        </div>
      </form>
    </div>
  );
}
