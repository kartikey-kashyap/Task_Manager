import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, Users, LogOut, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, role: 'All' },
    { name: 'Projects', path: '/projects', icon: FolderKanban, role: 'All' },
    { name: 'Tasks', path: '/tasks', icon: CheckSquare, role: 'All' },
    { name: 'Team', path: '/team', icon: Users, role: 'Admin' },
  ];

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/auth/account');
        logout();
      } catch (err) {
        console.error('Failed to delete account:', err);
        alert('Failed to delete account');
      }
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        TaskManager
        <button className="sidebar-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <ul className="sidebar-nav">
        {navItems.filter(item => item.role === 'All' || item.role === user?.role).map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.name}>
              <Link
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon />
                <span>{item.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="sidebar-footer" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
        <button 
          onClick={handleDeleteAccount}
          className="logout-btn"
          style={{color: 'var(--danger)'}}
        >
          <span style={{marginRight: '0.75rem', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'}}>!</span>
          Delete Account
        </button>
        <button 
          onClick={logout}
          className="logout-btn"
        >
          <LogOut style={{marginRight: '0.75rem', width: '20px', height: '20px'}} />
          Logout
        </button>
      </div>
    </aside>
  );
}
