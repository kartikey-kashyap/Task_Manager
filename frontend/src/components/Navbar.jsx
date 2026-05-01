import { Bell, Search, UserCircle, Menu } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Navbar({ onMenuClick }) {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button 
          className="mobile-menu-btn" 
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>
        <div className="search-bar">
          <Search size={18} color="var(--secondary)" />
          <input 
            type="text" 
            placeholder="Search tasks..." 
          />
        </div>
      </div>

      <div className="nav-actions">
        <div style={{ position: 'relative' }}>
          <button 
            className="notification-bell"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Bell size={24} />
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>
          
          {showDropdown && (
            <div className="notification-dropdown">
              <div className="dropdown-header">Notifications</div>
              <div className="dropdown-list">
                {notifications.length === 0 ? (
                  <div style={{padding: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem'}}>No notifications</div>
                ) : (
                  notifications.map(notification => (
                    <div 
                      key={notification._id} 
                      className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                    >
                      <p style={{opacity: notification.isRead ? 0.6 : 1}}>{notification.message}</p>
                      <span>{new Date(notification.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="nav-profile">
          <UserCircle size={36} color="var(--secondary)" />
          <div className="profile-info">
            <h4>{user?.name}</h4>
            <p>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
