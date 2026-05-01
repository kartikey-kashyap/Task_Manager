import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Team() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 style={{fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-main)'}}>Team Members</h1>
      </div>

      <div className="item-grid">
        {users.map(user => (
          <div key={user._id} className="team-card">
            <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            <span className={`badge ${user.role === 'Admin' ? 'admin' : 'member'}`}>
              {user.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
