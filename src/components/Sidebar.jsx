import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Course Portal</h2>
        <p className="user-info">{user?.name} ({user?.role})</p>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">📊</span>Dashboard
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">📚</span>Courses
        </NavLink>
        {user?.role === 'student' && (
          <NavLink to="/schedule" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span className="nav-icon">📅</span>My Schedule
          </NavLink>
        )}
        <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          <span className="nav-icon">👤</span>Profile
        </NavLink>
        {user?.role === 'admin' && (
          <>
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">⚙️</span>Admin Panel
            </NavLink>
            <NavLink to="/students" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">🎓</span>Students
            </NavLink>
            <NavLink to="/add-student" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">➕</span>Add Student
            </NavLink>
            <NavLink to="/course-report" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              <span className="nav-icon">📋</span>Course Report
            </NavLink>
          </>
        )}
      </nav>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  );
};

export default Sidebar;
