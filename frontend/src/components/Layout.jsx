// frontend/src/components/Layout.jsx
import { useState } from 'react';

export default function Layout({ children, setToken, activeTab, setActiveTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')) || { name: 'User' };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 to-emerald-100 overflow-hidden font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out md:relative md:translate-x-0 flex flex-col`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-emerald-400">TicketFlow</h1>
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            ✕
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => handleNavClick('dashboard')}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${activeTab === 'dashboard' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => handleNavClick('settings')}
            className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition ${activeTab === 'settings' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="text-sm truncate">
              <p className="font-semibold">{user.name}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-800 rounded-lg transition"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 justify-between shrink-0 shadow-sm">
          <button 
            className="md:hidden text-slate-600 focus:outline-none" 
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="hidden md:block text-slate-500 text-sm font-medium">
            Welcome back to your workspace.
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-transparent p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}