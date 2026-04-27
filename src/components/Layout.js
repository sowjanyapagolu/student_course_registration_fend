import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCourses');
    navigate('/login');
  };

  const openSettings = () => {
    setShowSettings(true);
    setShowProfileMenu(false);
  };

  const openProfile = () => {
    setShowProfile(true);
    setShowProfileMenu(false);
  };

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
            <div 
              className="profile-button" 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <div className="profile-avatar">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="profile-info">
                <span className="profile-name">{user?.name}</span>
                <span className="profile-role">{user?.role}</span>
              </div>
              <div className="profile-dropdown-icon">▼</div>
            </div>
            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-item" onClick={openProfile}>
                  <span>👤</span> View Profile
                </div>
                <div className="profile-menu-item" onClick={openSettings}>
                  <span>⚙️</span> Settings
                </div>
                <div className="profile-menu-item" onClick={handleLogout}>
                  <span>🚪</span> Logout
                </div>
              </div>
            )}
          </div>
        </div>
        <Outlet />
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      </div>
    </div>
  );
};

const SettingsModal = ({ onClose }) => {
  const [user, setUser] = useState(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const profileData = JSON.parse(localStorage.getItem('profileData')) || {
      cgpa: 3.5,
      completedCredits: 60,
      remainingCredits: 60
    };
    return { ...userData, ...profileData };
  });

  const handleSave = () => {
    const { name, email, role } = user;
    localStorage.setItem('user', JSON.stringify({ name, email, role }));
    if (user.role === 'student') {
      localStorage.setItem('profileData', JSON.stringify({
        cgpa: user.cgpa || 3.5,
        completedCredits: user.completedCredits || 60,
        remainingCredits: user.remainingCredits || 60
      }));
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="settings-section">
            <h3>📝 Edit Profile</h3>
            <div className="form-group">
              <label>Name</label>
              <input 
                type="text" 
                value={user.name || ''} 
                onChange={(e) => setUser({...user, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                value={user.email || ''} 
                onChange={(e) => setUser({...user, email: e.target.value})}
              />
            </div>
          </div>
          {user.role === 'student' && (
            <div className="settings-section">
              <h3>📊 Academic Information</h3>
              <div className="form-group">
                <label>CGPA (Default: 3.5)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  max="4.0" 
                  value={user.cgpa || 3.5} 
                  onChange={(e) => setUser({...user, cgpa: parseFloat(e.target.value) || 3.5})}
                />
              </div>
              <div className="form-group">
                <label>Completed Credits (Default: 60)</label>
                <input 
                  type="number" 
                  value={user.completedCredits || 60} 
                  onChange={(e) => setUser({...user, completedCredits: parseInt(e.target.value) || 60})}
                />
              </div>
              <div className="form-group">
                <label>Remaining Credits (Default: 60)</label>
                <input 
                  type="number" 
                  value={user.remainingCredits || 60} 
                  onChange={(e) => setUser({...user, remainingCredits: parseInt(e.target.value) || 60})}
                />
              </div>
            </div>
          )}
          <div className="settings-actions">
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileModal = ({ onClose }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const profileData = JSON.parse(localStorage.getItem('profileData')) || { cgpa: 3.5, completedCredits: 60, remainingCredits: 60 };
  
  const eventsData = [2, 4, 3, 5, 6];
  const certificatesData = [1, 2, 2, 3, 4];
  const awardData = [0, 1, 1, 2, 3];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>👤 Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <div className="profile-info-section">
            <div className="profile-avatar-large">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className="role-badge">{user?.role}</span>
          </div>
          
          {user?.role === 'student' ? (
            <div className="charts-section">
              <div className="chart-container">
                <h4>🎆 Events Participated</h4>
                <div className="bar-chart">
                  {eventsData.map((value, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar events-bar" style={{height: `${value * 15}px`}}></div>
                      <span>Sem {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-container">
                <h4>🏆 Certificates</h4>
                <div className="bar-chart">
                  {certificatesData.map((value, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar certificates-bar" style={{height: `${value * 20}px`}}></div>
                      <span>Sem {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-container">
                <h4>🏅 Awards (CGPA Based)</h4>
                <div className="bar-chart">
                  {awardData.map((value, index) => (
                    <div key={index} className="bar-item">
                      <div className="bar awards-bar" style={{height: `${value * 25}px`}}></div>
                      <span>Sem {index + 1}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="admin-profile-section">
              <div className="admin-stats">
                <div className="admin-stat-item">
                  <h4>🎆 Events Conducted</h4>
                  <p>15 Events</p>
                </div>
                <div className="admin-stat-item">
                  <h4>🏅 Awards Given</h4>
                  <p>45 Awards</p>
                </div>
                <div className="admin-stat-item">
                  <h4>👥 Students Managed</h4>
                  <p>120 Students</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;
