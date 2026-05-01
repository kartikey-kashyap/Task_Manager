import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-card">
          <h2>Create an Account</h2>
          
          {error && <div style={{background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                className="form-control"
                placeholder="Enter your full name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="email" 
                className="form-control"
                placeholder="Enter your email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                className="form-control"
                placeholder="••••••••"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label>Role</label>
              <select 
                className="form-control"
                value={role} 
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <button type="submit" className="auth-btn-primary" style={{width: 'auto', padding: '0.875rem 3rem'}}>
                Sign Up
              </button>
            </div>
          </form>
          <p style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--secondary-pivot)'}}>
            Already have an account? <Link to="/login" style={{fontWeight: '600', color: 'var(--nocturnal-navy)'}}>Sign In</Link>
          </p>
        </div>
      </div>
      
      <div className="auth-right">
        <div className="auth-right-content">
          <h1>Track your<br/>Projects</h1>
          <div className="orange-block">
            We work faster together
          </div>
        </div>
      </div>
    </div>
  );
}
