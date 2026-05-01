import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function Tasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [newTask, setNewTask] = useState({
    title: '', description: '', priority: 'Medium', projectId: '', assignedTo: '', dueDate: ''
  });

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') {
      fetchProjectsAndUsers();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjectsAndUsers = async () => {
    try {
      const [projRes, usersRes] = await Promise.all([
        api.get('/projects'),
        api.get('/auth/users')
      ]);
      setProjects(projRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, newTask);
      } else {
        await api.post('/tasks', newTask);
      }
      setShowModal(false);
      setEditingTask(null);
      setNewTask({ title: '', description: '', priority: 'Medium', projectId: '', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignUpdate = async (id, assignedTo) => {
    try {
      await api.put(`/tasks/${id}`, { assignedTo });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 style={{fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-main)'}}>Tasks</h1>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => {
              setEditingTask(null);
              setNewTask({ title: '', description: '', priority: 'Medium', projectId: '', assignedTo: '', dueDate: '' });
              setShowModal(true);
            }}
            className="btn-action"
          >
            + New Task
          </button>
        )}
      </div>

      <div style={{marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end'}}>
        <select 
          className="form-control" 
          style={{width: 'auto'}}
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="All">All Tasks</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
          <option value="Overdue">Overdue</option>
        </select>
      </div>

      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Project</th>
                <th>Assigned To</th>
                <th>Priority</th>
                <th>Status</th>
                {user?.role === 'Admin' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {tasks.filter(task => {
                if (filterStatus === 'All') return true;
                if (filterStatus === 'Overdue') {
                  return task.status !== 'Done' && task.dueDate && new Date(task.dueDate) < new Date();
                }
                return task.status === filterStatus;
              }).map(task => (
                <tr key={task._id}>
                  <td style={{fontWeight: '500', color: 'var(--text-main)'}}>
                    {task.title}
                    {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done' && (
                      <span style={{color: 'var(--danger)', fontSize: '0.75rem', marginLeft: '0.5rem', fontWeight: 'bold'}}>(Overdue)</span>
                    )}
                  </td>
                  <td style={{color: 'var(--text-muted)'}}>{task.projectId?.name || 'N/A'}</td>
                  <td>
                    {user?.role === 'Admin' ? (
                      <select 
                        className="action-select"
                        value={task.assignedTo?._id || ''}
                        onChange={(e) => handleAssignUpdate(task._id, e.target.value)}
                        style={{width: '100%'}}
                      >
                        <option value="">Unassigned</option>
                        {users.map(u => (
                          <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                      </select>
                    ) : (
                      <span style={{color: 'var(--text-muted)'}}>{task.assignedTo?.name || 'Unassigned'}</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge ${
                      task.priority === 'High' ? 'high' :
                      task.priority === 'Medium' ? 'medium' :
                      'low'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="action-select"
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                    >
                      <option value="Todo">Todo</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                  </td>
                  {user?.role === 'Admin' && (
                    <td style={{display: 'flex', gap: '0.5rem'}}>
                      <button 
                        onClick={() => {
                          setEditingTask(task);
                          setNewTask({
                            title: task.title || '',
                            description: task.description || '',
                            priority: task.priority || 'Medium',
                            projectId: task.projectId?._id || '',
                            assignedTo: task.assignedTo?._id || '',
                            dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
                          });
                          setShowModal(true);
                        }}
                        style={{color: 'var(--primary)', background: 'none', border: 'none'}}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-danger"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
              {tasks.filter(task => {
                if (filterStatus === 'All') return true;
                if (filterStatus === 'Overdue') {
                  return task.status !== 'Done' && task.dueDate && new Date(task.dueDate) < new Date();
                }
                return task.status === filterStatus;
              }).length === 0 && (
                <tr>
                  <td colSpan={user?.role === 'Admin' ? 6 : 5} style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
                    No tasks found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>
              {editingTask ? 'Edit Task' : 'Create Task'}
            </h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Project</label>
                <select 
                  className="form-control"
                  value={newTask.projectId}
                  onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(p => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select 
                  className="form-control"
                  value={newTask.assignedTo}
                  onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select 
                  className="form-control"
                  value={newTask.priority}
                  onChange={e => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input 
                  type="date" 
                  className="form-control"
                  value={newTask.dueDate}
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-action"
                >
                  {editingTask ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
