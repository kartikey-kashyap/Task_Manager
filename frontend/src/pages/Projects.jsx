import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Users } from 'lucide-react';

export default function Projects() {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });

  useEffect(() => {
    fetchProjects();
    if (user?.role === 'Admin') {
      fetchUsers();
    }
  }, [user]);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setAllUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, newProject);
      } else {
        await api.post('/projects', newProject);
      }
      setShowModal(false);
      setEditingProject(null);
      setNewProject({ name: '', description: '', members: [] });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (userId) => {
    try {
      await api.post(`/projects/${selectedProject._id}/members`, { userId });
      
      // Update local state to reflect change without full refetch
      const userObj = allUsers.find(u => u._id === userId);
      setSelectedProject(prev => ({
        ...prev,
        members: [...prev.members, userObj]
      }));
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      await api.delete(`/projects/${selectedProject._id}/members`, { data: { userId } });
      
      // Update local state
      setSelectedProject(prev => ({
        ...prev,
        members: prev.members.filter(m => m._id !== userId)
      }));
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 style={{fontSize: '1.875rem', fontWeight: '700', color: 'var(--text-main)'}}>Projects</h1>
        {user?.role === 'Admin' && (
          <button 
            onClick={() => {
              setEditingProject(null);
              setNewProject({ name: '', description: '', members: [] });
              setShowModal(true);
            }}
            className="btn-action"
          >
            + New Project
          </button>
        )}
      </div>

      <div className="item-grid">
        {projects.map(project => (
          <div key={project._id} className="project-card">
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <div className="project-meta">
              <div>
                Members: <span style={{fontWeight:'500', color:'var(--text-main)'}}>{project.members.length}</span>
              </div>
              <div style={{background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px'}}>
                {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
            {user?.role === 'Admin' && (
              <div style={{marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                <button 
                  className="btn-secondary" 
                  style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}}
                  onClick={() => {
                    setSelectedProject(project);
                    setShowMemberModal(true);
                  }}
                >
                  <Users size={16} /> Manage Members
                </button>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button 
                    className="btn-secondary" 
                    style={{flex: 1}}
                    onClick={() => {
                      setEditingProject(project);
                      setNewProject({ name: project.name, description: project.description, members: project.members.map(m => m._id) });
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-secondary" 
                    style={{flex: 1, color: 'var(--danger)', borderColor: 'var(--danger)'}}
                    onClick={() => handleDeleteProject(project._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div style={{gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--text-muted)'}}>
            No projects found.
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>
              {editingProject ? 'Edit Project' : 'Create Project'}
            </h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  className="form-control"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea 
                  className="form-control"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  rows={3}
                ></textarea>
              </div>
              {!editingProject && (
                <div className="form-group">
                  <label>Add Members</label>
                  <div style={{maxHeight: '150px', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: '4px', padding: '0.5rem'}}>
                    {allUsers.filter(u => u._id !== user._id).map(u => (
                      <div key={u._id} style={{display: 'flex', alignItems: 'center', marginBottom: '0.5rem'}}>
                        <input 
                          type="checkbox" 
                          id={`user-${u._id}`}
                          checked={newProject.members.includes(u._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewProject({...newProject, members: [...newProject.members, u._id]});
                            } else {
                              setNewProject({...newProject, members: newProject.members.filter(m => m !== u._id)});
                            }
                          }}
                          style={{marginRight: '0.5rem'}}
                        />
                        <label htmlFor={`user-${u._id}`} style={{marginBottom: 0, fontWeight: 'normal'}}>{u.name} ({u.email})</label>
                      </div>
                    ))}
                    {allUsers.filter(u => u._id !== user._id).length === 0 && (
                      <div style={{color: 'var(--text-muted)', fontSize: '0.875rem'}}>No other users found.</div>
                    )}
                  </div>
                </div>
              )}
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
                  {editingProject ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Members Modal */}
      {showMemberModal && selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content" style={{maxWidth: '500px'}}>
            <h2 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem'}}>Manage Members: {selectedProject.name}</h2>
            
            <div style={{marginBottom: '1.5rem'}}>
              <h3 style={{fontSize: '1rem', marginBottom: '0.5rem'}}>Current Members</h3>
              <div style={{border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden'}}>
                {selectedProject.members.map(member => (
                  <div key={member._id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border)'}}>
                    <div>
                      <div style={{fontWeight: '500'}}>{member.name}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{member.email}</div>
                    </div>
                    <button 
                      onClick={() => handleRemoveMember(member._id)}
                      className="text-danger"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {selectedProject.members.length === 0 && (
                  <div style={{padding: '1rem', textAlign: 'center', color: 'var(--text-muted)'}}>No members added.</div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{fontSize: '1rem', marginBottom: '0.5rem'}}>Add Team Member</h3>
              <div style={{border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden', maxHeight: '200px', overflowY: 'auto'}}>
                {allUsers
                  .filter(u => u._id !== selectedProject.createdBy && !selectedProject.members.find(m => m._id === u._id))
                  .map(user => (
                  <div key={user._id} style={{display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid var(--border)'}}>
                    <div>
                      <div style={{fontWeight: '500'}}>{user.name}</div>
                      <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>{user.email}</div>
                    </div>
                    <button 
                      onClick={() => handleAddMember(user._id)}
                      style={{color: 'var(--primary)', background: 'none', fontSize: '0.875rem'}}
                    >
                      Add
                    </button>
                  </div>
                ))}
                {allUsers.filter(u => u._id !== selectedProject.createdBy && !selectedProject.members.find(m => m._id === u._id)).length === 0 && (
                  <div style={{padding: '1rem', textAlign: 'center', color: 'var(--text-muted)'}}>All available users are already in this project.</div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowMemberModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
