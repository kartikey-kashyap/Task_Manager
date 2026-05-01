import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-card">
          <h2>Welcome back!</h2>
          
          {error && <div style={{background: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem'}}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
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
            <div style={{textAlign: 'right', marginBottom: '1.5rem'}}>
              <a href="#" style={{fontSize: '0.875rem', color: 'var(--secondary-pivot)', fontWeight: '500'}}>Forgot Password?</a>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <button type="submit" className="auth-btn-primary" style={{width: 'auto', padding: '0.875rem 3rem'}}>
                Login
              </button>
            </div>
          </form>
          
          <p style={{marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--secondary-pivot)'}}>
            Not a member? <Link to="/signup" style={{fontWeight: '600', color: 'var(--nocturnal-navy)'}}>Register now</Link>
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
