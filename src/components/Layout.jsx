import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <div className="top-header">
          <div className="header-title">
            <h2>Student Course Registration System</h2>
            <p>Academic Year 2024-2025 | Spring Semester</p>
          </div>
          <div className="profile-section">
            <div className="profile-button" onClick={() => navigate('/profile')}>
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name}</span>
                <span className="profile-role">{user?.role}</span>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
