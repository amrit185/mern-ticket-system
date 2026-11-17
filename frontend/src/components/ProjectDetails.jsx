// frontend/src/components/ProjectDetails.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TicketModal from './TicketModal'; 
import EditTicketModal from './EditTicketModal';

export default function ProjectDetails({ project, onBack }) {
  const [tickets, setTickets] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium' });
  
  const [activeTicket, setActiveTicket] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('All');

  const axiosConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const fetchTickets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tickets/${project._id}`, axiosConfig);
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching tickets:', err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [project._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/tickets/${project._id}`, formData, axiosConfig);
      setFormData({ title: '', description: '', priority: 'Medium' });
      fetchTickets();
    } catch (err) {
      console.error('Error creating ticket:', err);
    }
  };

  const deleteTicket = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tickets/${id}`, axiosConfig);
      setTickets(tickets.filter(t => t._id !== id));
    } catch (err) {
      console.error('Error deleting ticket:', err);
    }
  };

  const handleTicketUpdated = (updatedTicket) => {
    setTickets(tickets.map(t => t._id === updatedTicket._id ? updatedTicket : t));
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStatus = destination.droppableId;

    setTickets((prevTickets) => 
      prevTickets.map(ticket => 
        ticket._id === draggableId ? { ...ticket, status: newStatus } : ticket
      )
    );

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/tickets/${draggableId}`, 
        { status: newStatus }, 
        axiosConfig
      );
    } catch (err) {
      console.error('Error updating ticket status:', err);
      fetchTickets(); 
    }
  };

  const columns = ['To Do', 'In Progress', 'Done'];

  const getPriorityColor = (priority) => {
    if (priority === 'High') return 'bg-red-100 text-red-800 border-red-200';
    if (priority === 'Medium') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-emerald-100 text-emerald-800 border-emerald-200';
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = filterPriority === 'All' ? true : ticket.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <nav className="flex text-sm text-slate-500 mb-6 font-medium">
        <button onClick={onBack} className="hover:text-emerald-600 transition">Projects</button>
        <span className="mx-2">/</span>
        <span className="text-slate-800">{project.title}</span>
        <span className="mx-2">/</span>
        <span className="text-slate-800">Board</span>
      </nav>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">{project.title}</h2>
        <p className="text-slate-600 mt-1">{project.description}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Task Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              required
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Short description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
              required
            />
          </div>
          <div className="w-full lg:w-48">
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg hover:bg-emerald-700 font-medium shadow-sm transition">
            Add Task
          </button>
        </form>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex-1 w-full relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search tickets by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm"
          />
        </div>
        <div className="w-full md:w-64 flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Filter:</label>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition text-sm font-medium text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map(status => (
            <div key={status} className="bg-slate-100 rounded-xl p-4 flex flex-col min-h-125">
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="font-bold text-slate-700 uppercase text-sm tracking-wider">{status}</h3>
                <span className="bg-slate-200 text-slate-600 rounded-full px-2.5 py-0.5 text-xs font-bold">
                  {filteredTickets.filter(t => t.status === status).length}
                </span>
              </div>
              
              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 transition-colors duration-200 rounded-lg ${snapshot.isDraggingOver ? 'bg-slate-200' : 'bg-transparent'}`}
                  >
                    {filteredTickets
                      .filter(ticket => ticket.status === status)
                      .map((ticket, index) => (
                        <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-3 group 
                                ${snapshot.isDragging ? 'shadow-lg ring-2 ring-emerald-500 ring-opacity-50 rotate-2' : 'hover:border-emerald-300'} transition-all`}
                              style={provided.draggableProps.style}
                            >
                              <div className="flex justify-between items-start mb-2 gap-2">
                                <h4 className="font-bold text-slate-800 leading-tight">{ticket.title}</h4>
                                <button 
                                  onClick={() => deleteTicket(ticket._id)}
                                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Delete task"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{ticket.description}</p>
                              
                              <div className="flex justify-between items-center mt-2">
                                <span className={`text-xs px-2 py-1 border rounded-md font-bold ${getPriorityColor(ticket.priority)}`}>
                                  {ticket.priority}
                                </span>
                                
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditingTicket(ticket)}
                                    className="text-xs text-slate-500 hover:text-green-600 font-semibold flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200 hover:border-green-200 transition"
                                  >
                                    ✏️ Edit
                                  </button>

                                  <button
                                    onClick={() => setActiveTicket(ticket)}
                                    className="text-xs text-slate-500 hover:text-emerald-600 font-semibold flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-200 hover:border-emerald-200 transition"
                                  >
                                    💬 Details
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {activeTicket && (
        <TicketModal 
          ticket={activeTicket} 
          onClose={() => setActiveTicket(null)} 
        />
      )}

      {editingTicket && (
        <EditTicketModal 
          ticket={editingTicket} 
          onClose={() => setEditingTicket(null)} 
          onTicketUpdated={handleTicketUpdated}
        />
      )}
    </div>
  );
}