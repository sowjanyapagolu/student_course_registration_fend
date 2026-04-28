import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalCourses: 0, enrolledCourses: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [coursesRes, enrollRes] = await Promise.all([
        fetch('http://localhost:8080/courses'),
        fetch(`http://localhost:8080/enrollments/student/${user?.id}`)
      ]);
      const courses = await coursesRes.json();
      const enrollments = await enrollRes.json();
      const enrolled = enrollments.filter(e => e.status === 'ENROLLED');
      setStats({ totalCourses: courses.length, enrolledCourses: enrolled.length });
    } catch (err) { console.error(err); }
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-title">Welcome back, <span className="highlight">{user?.name}!</span></h1>
          <p className="welcome-subtitle">Ready to explore your academic journey? Let's make this semester amazing! 🎆</p>
        </div>
        <div className="welcome-animation">
          <div className="floating-icon">🎓</div>
          <div className="floating-icon">📚</div>
          <div className="floating-icon">✨</div>
        </div>
      </div>

      <div className="colorful-stats-grid">
        <div className="colorful-stat-card purple" onClick={() => navigate('/courses')} style={{cursor:'pointer'}}>
          <div className="stat-icon-large">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3><p>Available Courses</p>
            <div className="stat-progress"><div className="progress-bar" style={{width:'100%'}}></div></div>
          </div>
          <div className="card-glow purple-glow"></div>
        </div>
        <div className="colorful-stat-card green" onClick={() => navigate('/schedule')} style={{cursor:'pointer'}}>
          <div className="stat-icon-large">✅</div>
          <div className="stat-content">
            <h3>{stats.enrolledCourses}</h3><p>Enrolled Courses</p>
            <div className="stat-progress"><div className="progress-bar" style={{width:`${stats.totalCourses ? (stats.enrolledCourses/stats.totalCourses)*100 : 0}%`}}></div></div>
          </div>
          <div className="card-glow green-glow"></div>
        </div>
        <div className="colorful-stat-card blue" onClick={() => navigate('/profile')} style={{cursor:'pointer'}}>
          <div className="stat-icon-large">👤</div>
          <div className="stat-content">
            <h3>{user?.role?.toUpperCase()}</h3><p>Account Type</p>
            <div className="stat-progress"><div className="progress-bar" style={{width:'100%'}}></div></div>
          </div>
          <div className="card-glow blue-glow"></div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="quick-actions-card">
          <h3>🚀 Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn purple-btn" onClick={() => navigate('/courses')}><span>📚</span>Browse Courses</button>
            <button className="action-btn green-btn" onClick={() => navigate('/schedule')}><span>📅</span>View Schedule</button>
            <button className="action-btn orange-btn" onClick={() => navigate('/profile')}><span>👤</span>My Profile</button>
          </div>
        </div>
        <div className="academic-info-card">
          <h3>🎯 Academic Overview</h3>
          <div className="info-grid">
            <div className="info-item"><div className="info-icon">📅</div><div><strong>Current Semester</strong><p>Spring 2024</p></div></div>
            <div className="info-item"><div className="info-icon">📊</div><div><strong>Registration Status</strong><p className="status-open">Open</p></div></div>
            <div className="info-item"><div className="info-icon">⏰</div><div><strong>Last Activity</strong><p>{new Date().toLocaleDateString()}</p></div></div>
            <div className="info-item"><div className="info-icon">🎆</div><div><strong>Academic Year</strong><p>2024-2025</p></div></div>
          </div>
        </div>
      </div>

      <div className="motivational-section">
        <div className="motivation-card">
          <div className="motivation-icon">🌟</div>
          <h3>Keep Going!</h3>
          <p>"Education is the most powerful weapon which you can use to change the world." - Nelson Mandela</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
