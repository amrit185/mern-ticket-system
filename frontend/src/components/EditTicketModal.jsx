// frontend/src/components/EditTicketModal.jsx
import { useState } from 'react';
import axios from 'axios';

export default function EditTicketModal({ ticket, onClose, onTicketUpdated }) {
  const [formData, setFormData] = useState({
    title: ticket.title,
    description: ticket.description,
    priority: ticket.priority,
    status: ticket.status
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const axiosConfig = {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    };

    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/tickets/${ticket._id}`, formData, axiosConfig);
      onTicketUpdated(res.data); 
      onClose(); 
    } catch (err) {
      console.error('Error updating ticket:', err);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Edit Task</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 transition text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 mt-6">
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 font-medium transition"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}