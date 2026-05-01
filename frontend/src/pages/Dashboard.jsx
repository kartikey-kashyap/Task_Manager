import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CheckCircle, Clock, ListTodo, AlertTriangle } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div style={{padding: '2rem'}}>Loading dashboard...</div>;

  const getStatusCount = (status) => {
    const item = stats.statusCounts.find(s => s._id === status);
    return item ? item.count : 0;
  };

  const chartData = [
    { name: 'To Do', value: getStatusCount('Todo'), color: '#293041' }, // nocturnal-navy
    { name: 'In Progress', value: getStatusCount('In Progress'), color: '#A53C00' }, // kinetic-orange
    { name: 'Done', value: getStatusCount('Done'), color: '#10b981' }
  ];

  return (
    <div>
      <div className="page-header">
        <h1 style={{fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-main)'}}>Dashboard</h1>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <p>Total Tasks</p>
            <h3 style={{color: 'var(--nocturnal-navy)'}}>{stats.totalTasks}</h3>
          </div>
          <div className="stat-icon" style={{background: 'var(--tonal-break)', color: 'var(--nocturnal-navy)'}}>
            <ListTodo size={28} />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <p>Pending Tasks</p>
            <h3 style={{color: 'var(--kinetic-orange)'}}>{stats.pendingTasks}</h3>
          </div>
          <div className="stat-icon" style={{background: 'var(--data-tertiary)', color: 'var(--kinetic-orange)'}}>
            <Clock size={28} />
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-info">
            <p>Completed Tasks</p>
            <h3 style={{color: '#10b981'}}>{stats.completedTasks}</h3>
          </div>
          <div className="stat-icon emerald">
            <CheckCircle size={28} />
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <p>Overdue Tasks</p>
            <h3 style={{color: 'var(--danger)'}}>{stats.overdueTasks}</h3>
          </div>
          <div className="stat-icon" style={{background: '#fee2e2', color: '#ef4444'}}>
            <AlertTriangle size={28} />
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop: '2rem'}}>
        <h2 className="card-title">Recent Working Tasks</h2>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTasks?.map(task => (
                <tr key={task._id}>
                  <td style={{fontWeight: '500', color: 'var(--text-main)'}}>{task.title}</td>
                  <td style={{color: 'var(--text-muted)'}}>{task.projectId?.name || 'N/A'}</td>
                  <td style={{color: 'var(--text-muted)'}}>{task.assignedTo?.name || 'Unassigned'}</td>
                  <td>
                    <span className={`badge ${
                      task.status === 'Done' ? 'low' :
                      task.status === 'In Progress' ? 'medium' :
                      'high'
                    }`}>
                      {task.status}
                    </span>
                  </td>
                  <td style={{color: 'var(--text-muted)'}}>
                    {new Date(task.updatedAt).toLocaleDateString()} {new Date(task.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                </tr>
              ))}
              {(!stats.recentTasks || stats.recentTasks.length === 0) && (
                <tr>
                  <td colSpan={5} style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
                    No recent tasks.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-grid" style={{marginTop: '2rem'}}>
        <div className="card" style={{background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.5) 0%, rgba(243, 244, 246, 0.5) 100%)'}}>
          <h2 className="card-title" style={{marginBottom: '1.5rem'}}>Task Status Distribution</h2>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
            {/* Chart Section */}
            <div style={{height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value) => [`${value} tasks`, 'Count']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Stats Summary - Only show when there are tasks */}
            {chartData.some(item => item.value > 0) && (
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                {chartData.map((item, idx) => (
                  <div key={idx} style={{textAlign: 'center', padding: '0.75rem'}}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      margin: '0 auto 0.5rem'
                    }}></div>
                    <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0'}}>{item.name}</p>
                    <h4 style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: '0'}}>{item.value}</h4>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {user?.role === 'Admin' && (
          <div className="card" style={{background: 'linear-gradient(135deg, rgba(249, 250, 251, 0.5) 0%, rgba(243, 244, 246, 0.5) 100%)'}}>
            <h2 className="card-title" style={{marginBottom: '1.5rem'}}>Tasks per User</h2>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {/* Chart Section */}
              <div style={{height: '250px'}}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.tasksPerUser} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                      cursor={{fill: '#f1f5f9'}}
                      formatter={(value) => [`${value} tasks`, 'Count']}
                    />
                    <Bar dataKey="count" fill="#293041" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Summary - Only show when there are tasks */}
              {stats.tasksPerUser && stats.tasksPerUser.length > 0 && (
                <div style={{display: 'grid', gridTemplateColumns: `repeat(${Math.min(stats.tasksPerUser.length, 3)}, 1fr)`, gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '8px', border: '1px solid #e5e7eb'}}>
                  {stats.tasksPerUser.map((user, idx) => (
                    <div key={idx} style={{textAlign: 'center', padding: '0.75rem'}}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#293041',
                        margin: '0 auto 0.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '0.875rem',
                        fontWeight: '700'
                      }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', margin: '0.25rem 0'}}>{user.name}</p>
                      <h4 style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-main)', margin: '0'}}>{user.count}</h4>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
