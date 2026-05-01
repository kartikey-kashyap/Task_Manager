import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet, Navigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function MainLayout() {
  const { user, loading } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) return <div style={{display:'flex', height:'100vh', alignItems:'center', justifyContent:'center'}}>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="app-layout">
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
      
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className="main-wrapper">
        <Navbar onMenuClick={toggleMobileMenu} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
