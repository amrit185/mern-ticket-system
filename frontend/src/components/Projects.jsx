// frontend/src/components/Projects.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectDetails from './ProjectDetails';

export default function Projects({ setToken }) {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [selectedProject, setSelectedProject] = useState(null);

  const axiosConfig = {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/projects`, axiosConfig);
      
      // SAFETY CHECK: Ensure backend returned an array before saving
      if (Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        console.error("API returned invalid data. Check your .env file!", res.data);
        setProjects([]); // Prevent crash
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects([]); // Prevent crash on network error
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/projects`, formData, axiosConfig);
      setFormData({ title: '', description: '' }); 
      fetchProjects(); 
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/projects/${id}`, axiosConfig);
      fetchProjects(); 
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  // CONDITIONAL RENDERING: Show tickets if a project is selected
  if (selectedProject) {
    return <ProjectDetails project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  // Otherwise, show the normal projects dashboard
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-800">My Projects</h2>
        <p className="text-slate-500 mt-1">Manage your teams and workspaces</p>
      </div>

      {/* Create Project Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition"
          />
          <button type="submit" className="bg-emerald-600 text-white px-8 py-2.5 rounded-lg hover:bg-emerald-700 font-medium shadow-sm transition">
            Create Project
          </button>
        </form>
      </div>

      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl">
                  {/* SAFE CHAINING: Prevents crash if title is ever missing */}
                  {project.title?.charAt(0)?.toUpperCase() || 'P'}
                </div>
                <h4 className="text-xl font-bold text-slate-800">{project.title}</h4>
              </div>
              <p className="text-slate-600 mb-6 text-sm line-clamp-2">
                {project.description || 'No description provided.'}
              </p>
            </div>
            
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
              <button 
                onClick={() => setSelectedProject(project)}
                className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm"
              >
                View Tickets &rarr;
              </button>

              <button 
                onClick={() => deleteProject(project._id)}
                className="text-red-500 text-sm font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
            <p className="text-slate-500">No projects found. Create your first workspace above!</p>
          </div>
        )}
      </div>
    </div>
  );
}