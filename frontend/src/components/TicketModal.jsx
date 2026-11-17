// frontend/src/components/TicketModal.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TicketModal({ ticket, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/${ticket._id}`, axiosConfig);
        setComments(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setLoading(false);
      }
    };
    fetchComments();
  }, [ticket._id]);

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/comments/${ticket._id}`, 
        { text: newComment }, 
        axiosConfig
      );
      setComments([...comments, res.data]); 
      setNewComment(''); 
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{ticket.title}</h2>
            <p className="text-slate-600 mt-2">{ticket.description}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 transition text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <h3 className="font-semibold text-slate-700 mb-4">Activity & Comments</h3>
          
          {loading ? (
            <p className="text-slate-500">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No comments yet. Start the conversation!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-sm text-slate-800">{comment.user?.name}</span>
                    <span className="text-xs text-slate-400">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{comment.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-white">
          <form onSubmit={handlePostComment} className="flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
            />
            <button 
              type="submit" 
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition"
            >
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}