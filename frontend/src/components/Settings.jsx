// frontend/src/components/Settings.jsx
import { useState } from 'react';
import axios from 'axios';

export default function Settings() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [name, setName] = useState(user.name || '');
  const [password, setPassword] = useState('');
  
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    const payload = {};
    if (name && name !== user.name) payload.name = name;
    if (password) payload.password = password;

    if (Object.keys(payload).length === 0) {
      setError('No changes made.');
      return;
    }

    setLoading(true);
    const axiosConfig = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/update`, payload, axiosConfig);
      
      localStorage.setItem('user', JSON.stringify(res.data));
      setUser(res.data);
      
      setPassword(''); 
      setMessage('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Account Settings</h2>
        <p className="text-slate-600 mt-1">Update your personal information and password.</p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        {message && <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">{message}</div>}
        {error && <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name (Letters only)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          <div className="pt-6 border-t border-slate-100">
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit"
              disabled={loading}
              className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg hover:bg-emerald-700 font-medium shadow-sm transition disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}