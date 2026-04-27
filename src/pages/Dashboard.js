import React, { useState, useEffect } from 'react';

const availableCourses = [
  { id: 1, name: 'Data Structures', code: 'CS201', credits: 4 },
  { id: 2, name: 'Database Systems', code: 'CS301', credits: 3 },
  { id: 3, name: 'Web Development', code: 'CS302', credits: 3 },
  { id: 4, name: 'Operating Systems', code: 'CS303', credits: 4 },
  { id: 5, name: 'Computer Networks', code: 'CS304', credits: 3 },
  { id: 6, name: 'Software Engineering', code: 'CS401', credits: 4 },
  { id: 7, name: 'Machine Learning', code: 'CS402', credits: 4 },
  { id: 8, name: 'Artificial Intelligence', code: 'CS403', credits: 4 }
];

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [stats, setStats] = useState({ totalCourses: 0, registeredCourses: 0, role: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', courses: [] });
  
  useEffect(() => {
    const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    setStats({ totalCourses: availableCourses.length, registeredCourses: selectedCourses.length, role: user?.role || 'student' });
  }, [user]);

  const showAvailableCourses = () => {
    setModalContent({ title: 'Available Courses', courses: availableCourses });
    setShowModal(true);
  };

  const showEnrolledCourses = () => {
    const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    const enrolledCourses = availableCourses.filter(course => selectedCourses.includes(course.id));
    setModalContent({ title: 'Enrolled Courses', courses: enrolledCourses });
    setShowModal(true);
  };
  
  return (
    <div className="dashboard-container">
      <div className="welcome-banner">
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome back, <span className="highlight">{user?.name}!</span>
          </h1>
          <p className="welcome-subtitle">
            Ready to explore your academic journey? Let's make this semester amazing! 🎆
          </p>
        </div>
        <div className="welcome-animation">
          <div className="floating-icon">🎓</div>
          <div className="floating-icon">📚</div>
          <div className="floating-icon">✨</div>
        </div>
      </div>

      <div className="colorful-stats-grid">
        <div className="colorful-stat-card purple" onClick={showAvailableCourses} style={{cursor: 'pointer'}}>
          <div className="stat-icon-large">📚</div>
          <div className="stat-content">
            <h3>{stats.totalCourses}</h3>
            <p>Available Courses</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '100%'}}></div>
            </div>
          </div>
          <div className="card-glow purple-glow"></div>
        </div>
        
        <div className="colorful-stat-card green" onClick={showEnrolledCourses} style={{cursor: 'pointer'}}>
          <div className="stat-icon-large">✅</div>
          <div className="stat-content">
            <h3>{stats.registeredCourses}</h3>
            <p>Enrolled Courses</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: `${(stats.registeredCourses/stats.totalCourses)*100}%`}}></div>
            </div>
          </div>
          <div className="card-glow green-glow"></div>
        </div>
        
        <div className="colorful-stat-card blue" onClick={() => setModalContent({title: 'Account Type', courses: []}) || setShowModal(true)} style={{cursor: 'pointer'}}>
          <div className="stat-icon-large">👤</div>
          <div className="stat-content">
            <h3>{stats.role.toUpperCase()}</h3>
            <p>Account Type</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '100%'}}></div>
            </div>
          </div>
          <div className="card-glow blue-glow"></div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="quick-actions-card">
          <h3>🚀 Quick Actions</h3>
          <div className="action-buttons">
            <button className="action-btn purple-btn" onClick={showAvailableCourses}>
              <span>📚</span>
              Browse Courses
            </button>
            <button className="action-btn green-btn" onClick={showEnrolledCourses}>
              <span>📅</span>
              View Schedule
            </button>
            <button className="action-btn orange-btn" onClick={() => setModalContent({title: 'Progress Report', courses: []}) || setShowModal(true)}>
              <span>📊</span>
              Progress Report
            </button>
            {stats.role === 'admin' && (
              <button className="action-btn red-btn" onClick={() => window.location.href = '/admin'}>
                <span>⚙️</span>
                Admin Panel
              </button>
            )}
          </div>
        </div>
        
        <div className="academic-info-card">
          <h3>🎯 Academic Overview</h3>
          <div className="info-grid">
            <div className="info-item" onClick={() => setModalContent({title: 'Semester Calendar', courses: []}) || setShowModal(true)} style={{cursor: 'pointer'}}>
              <div className="info-icon">📅</div>
              <div>
                <strong>Current Semester</strong>
                <p>Spring 2024</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📊</div>
              <div>
                <strong>Registration Status</strong>
                <p className="status-open">Open</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">⏰</div>
              <div>
                <strong>Last Activity</strong>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">🎆</div>
              <div>
                <strong>Academic Year</strong>
                <p>2024-2025</p>
              </div>
            </div>
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalContent.title}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {modalContent.title === 'Progress Report' ? (
                <div className="progress-report">
                  <div className="progress-stats">
                    <div className="progress-item">
                      <h4>CGPA</h4>
                      <p>{JSON.parse(localStorage.getItem('profileData'))?.cgpa || 3.5}</p>
                    </div>
                    <div className="progress-item">
                      <h4>Completed Credits</h4>
                      <p>{JSON.parse(localStorage.getItem('profileData'))?.completedCredits || 60}</p>
                    </div>
                    <div className="progress-item">
                      <h4>Remaining Credits</h4>
                      <p>{JSON.parse(localStorage.getItem('profileData'))?.remainingCredits || 60}</p>
                    </div>
                  </div>
                  <div className="bar-chart-section">
                    <h4>📈 Academic Progress</h4>
                    <div className="progress-bar-chart">
                      {[3.2, 3.4, 3.5, 3.6, 3.7].map((value, index) => (
                        <div key={index} className="progress-bar-item">
                          <div className="progress-bar-visual" style={{height: `${value * 30}px`}}></div>
                          <span>Sem {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : modalContent.title === 'Total Credits' ? (
                <div className="credits-info">
                  <div className="credit-breakdown">
                    <div className="credit-item">
                      <h4>Completed Credits</h4>
                      <p>{JSON.parse(localStorage.getItem('profileData'))?.completedCredits || 60}</p>
                    </div>
                    <div className="credit-item">
                      <h4>Remaining Credits</h4>
                      <p>{JSON.parse(localStorage.getItem('profileData'))?.remainingCredits || 60}</p>
                    </div>
                    <div className="credit-item">
                      <h4>Total Required</h4>
                      <p>120</p>
                    </div>
                  </div>
                </div>
              ) : modalContent.title === 'Account Type' ? (
                <div className="account-info">
                  <div className="account-details">
                    <h4>Account Information</h4>
                    <p><strong>Type:</strong> {JSON.parse(localStorage.getItem('user'))?.role || 'Student'}</p>
                    <p><strong>Status:</strong> Active</p>
                    <p><strong>Registration:</strong> Enabled</p>
                    <p><strong>Access Level:</strong> Standard</p>
                  </div>
                </div>
              ) : modalContent.title === 'Semester Calendar' ? (
                <div className="calendar-section">
                  <div className="calendar-grid">
                    <div className="calendar-header">Spring 2024 Calendar</div>
                    <div className="calendar-events">
                      <div className="event-item">
                        <span className="event-date">Jan 15</span>
                        <span className="event-desc">Semester Begins</span>
                      </div>
                      <div className="event-item">
                        <span className="event-date">Feb 20</span>
                        <span className="event-desc">Mid-term Exams</span>
                      </div>
                      <div className="event-item">
                        <span className="event-date">Mar 25</span>
                        <span className="event-desc">Spring Break</span>
                      </div>
                      <div className="event-item">
                        <span className="event-date">May 10</span>
                        <span className="event-desc">Final Exams</span>
                      </div>
                      <div className="event-item">
                        <span className="event-date">May 20</span>
                        <span className="event-desc">Semester Ends</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : modalContent.courses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No courses found</h3>
                  <p>There are currently no courses to display.</p>
                </div>
              ) : (
                <div className="courses-list">
                  {modalContent.courses.map(course => (
                    <div key={course.id} className="course-item">
                      <div className="course-info">
                        <h4>{course.name}</h4>
                        <p>Code: {course.code} | Credits: {course.credits}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;