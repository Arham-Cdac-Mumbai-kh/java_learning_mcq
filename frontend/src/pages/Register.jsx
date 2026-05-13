import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold">Create Account</h2>
          <p className="text-slate-500">Start your Java mastery journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-lg border dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-primary-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full btn-primary py-3">Register</button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
