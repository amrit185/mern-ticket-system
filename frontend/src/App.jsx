// frontend/src/App.jsx
import { useState } from 'react';
import Auth from './components/Auth';
import Projects from './components/Projects';
import Layout from './components/Layout';
// 1. ADD THIS IMPORT
import Settings from './components/Settings'; 

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="font-sans text-gray-900">
      {token ? (
        <Layout setToken={setToken} activeTab={activeTab} setActiveTab={setActiveTab}>
          
          {activeTab === 'dashboard' && <Projects setToken={setToken} />}

          {/* 2. REPLACE THE SETTINGS VIEW WITH THIS: */}
          {activeTab === 'settings' && <Settings />}

        </Layout>
      ) : (
        <Auth setToken={setToken} />
      )}
    </div>
  );
}