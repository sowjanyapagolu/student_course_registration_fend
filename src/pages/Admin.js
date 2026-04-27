import React, { useState, useEffect } from 'react';

const Admin = () => {
  const [systemStats, setSystemStats] = useState({
    totalUsers: 1,
    totalCourses: 8,
    activeRegistrations: 0
  });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', courses: [] });
  const [newCourse, setNewCourse] = useState({ name: '', code: '', credits: '' });
  const [newlyAddedCourses, setNewlyAddedCourses] = useState([]);
  
  useEffect(() => {
    const selectedCourses = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    setSystemStats(prev => ({
      ...prev,
      activeRegistrations: selectedCourses.length
    }));
  }, []);

  const handleAddCourse = () => {
    if (newCourse.name && newCourse.code && newCourse.credits) {
      const newCourses = JSON.parse(localStorage.getItem('newCourses')) || [];
      const courseToAdd = {
        id: Date.now(),
        name: newCourse.name,
        code: newCourse.code,
        credits: parseInt(newCourse.credits)
      };
      newCourses.push(courseToAdd);
      localStorage.setItem('newCourses', JSON.stringify(newCourses));
      console.log('Course added:', courseToAdd);
      console.log('All courses:', newCourses);
      setNewCourse({ name: '', code: '', credits: '' });
      setShowModal(false);
      alert(`Course added successfully! Total courses: ${newCourses.length}`);
    }
  };
  
  return (
    <div className="admin-dashboard-container">
      <div className="admin-welcome-banner">
        <div className="admin-welcome-content">
          <h1 className="admin-welcome-title">
            ⚙️ Admin Control Center
          </h1>
          <p className="admin-welcome-subtitle">
            Manage the entire system with powerful administrative tools 📊
          </p>
        </div>
        <div className="admin-animation">
          <div className="floating-icon admin-icon">🔧</div>
          <div className="floating-icon admin-icon">📊</div>
          <div className="floating-icon admin-icon">🔒</div>
        </div>
      </div>
      
      <div className="admin-colorful-stats-grid">
        <div className="admin-colorful-stat-card red">
          <div className="stat-icon-large">👥</div>
          <div className="stat-content">
            <h3>{systemStats.totalUsers}</h3>
            <p>Total Users</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '100%'}}></div>
            </div>
          </div>
          <div className="card-glow red-glow"></div>
        </div>
        
        <div className="admin-colorful-stat-card blue">
          <div className="stat-icon-large">📚</div>
          <div className="stat-content">
            <h3>{systemStats.totalCourses}</h3>
            <p>Total Courses</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '100%'}}></div>
            </div>
          </div>
          <div className="card-glow blue-glow"></div>
        </div>
        
        <div className="admin-colorful-stat-card green">
          <div className="stat-icon-large">📋</div>
          <div className="stat-content">
            <h3>{systemStats.activeRegistrations}</h3>
            <p>Active Registrations</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: `${(systemStats.activeRegistrations/systemStats.totalCourses)*100}%`}}></div>
            </div>
          </div>
          <div className="card-glow green-glow"></div>
        </div>
        
        <div className="admin-colorful-stat-card purple" onClick={() => {
          const courses = JSON.parse(localStorage.getItem('newCourses')) || [];
          console.log('Clicked newly added courses, found:', courses);
          setModalContent({title: 'Newly Added Courses', courses: courses});
          setShowModal(true);
        }} style={{cursor: 'pointer'}}>
          <div className="stat-icon-large">✨</div>
          <div className="stat-content">
            <h3>{JSON.parse(localStorage.getItem('newCourses'))?.length || 0}</h3>
            <p>Newly Added Courses</p>
            <div className="stat-progress">
              <div className="progress-bar" style={{width: '75%'}}></div>
            </div>
          </div>
          <div className="card-glow purple-glow"></div>
        </div>
      </div>
      
      <div className="admin-sections">
        <div className="admin-management-card">
          <h3>🛠️ System Management</h3>
          <div className="admin-action-grid">
            <button className="admin-action-btn red-admin-btn" onClick={() => setModalContent({title: 'Manage Courses', courses: []}) || setShowModal(true)}>
              <span>📚</span>
              <div>
                <strong>Manage Courses</strong>
                <p>Add, edit, delete courses</p>
              </div>
            </button>
            <button className="admin-action-btn blue-admin-btn" onClick={() => setModalContent({title: 'Student Allocation', courses: []}) || setShowModal(true)}>
              <span>👥</span>
              <div>
                <strong>Student Allocation</strong>
                <p>View assigned students & demographics</p>
              </div>
            </button>
            <button className="admin-action-btn green-admin-btn">
              <span>📊</span>
              <div>
                <strong>View Reports</strong>
                <p>Analytics & statistics</p>
              </div>
            </button>
            <button className="admin-action-btn purple-admin-btn" onClick={() => {
              const courses = JSON.parse(localStorage.getItem('newCourses')) || [];
              setModalContent({title: 'Newly Added Courses', courses: courses});
              setShowModal(true);
            }}>
              <span>✨</span>
              <div>
                <strong>Newly Added Courses</strong>
                <p>View recently added courses</p>
              </div>
            </button>
          </div>
        </div>
        
        <div className="admin-activity-card">
          <h3>📊 Recent System Activity</h3>
          <div className="activity-timeline">
            <div className="activity-item success">
              <div className="activity-icon">✅</div>
              <div className="activity-content">
                <strong>System Health Check</strong>
                <p>All systems operational - 2 min ago</p>
              </div>
            </div>
            <div className="activity-item info">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <strong>User Login</strong>
                <p>Admin logged in successfully - 5 min ago</p>
              </div>
            </div>
            <div className="activity-item warning">
              <div className="activity-icon">⚠️</div>
              <div className="activity-content">
                <strong>Database Backup</strong>
                <p>Scheduled backup completed - 1 hour ago</p>
              </div>
            </div>
            <div className="activity-item success">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <strong>Course Registration</strong>
                <p>New course enrollment - 2 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-tools-section">
        <div className="admin-tools-card">
          <h3>🚀 Advanced Tools</h3>
          <div className="tools-grid">
            <div className="tool-item">
              <div className="tool-icon">📊</div>
              <h4>Analytics Dashboard</h4>
              <p>Detailed system metrics</p>
            </div>
            <div className="tool-item">
              <div className="tool-icon">🔒</div>
              <h4>Security Center</h4>
              <p>Monitor system security</p>
            </div>
            <div className="tool-item">
              <div className="tool-icon">💾</div>
              <h4>Backup Manager</h4>
              <p>Data backup & recovery</p>
            </div>
            <div className="tool-item">
              <div className="tool-icon">📧</div>
              <h4>Notification Center</h4>
              <p>System alerts & messages</p>
            </div>
          </div>
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
              {modalContent.title === 'Manage Courses' ? (
                <div className="course-management">
                  <h4>🆕 Add New Course</h4>
                  <div className="course-form">
                    <div className="form-group">
                      <label>Course Name</label>
                      <input 
                        type="text" 
                        value={newCourse.name} 
                        onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                        placeholder="Enter course name"
                      />
                    </div>
                    <div className="form-group">
                      <label>Course Code</label>
                      <input 
                        type="text" 
                        value={newCourse.code} 
                        onChange={(e) => setNewCourse({...newCourse, code: e.target.value})}
                        placeholder="Enter course code"
                      />
                    </div>
                    <div className="form-group">
                      <label>Credits</label>
                      <input 
                        type="number" 
                        value={newCourse.credits} 
                        onChange={(e) => setNewCourse({...newCourse, credits: e.target.value})}
                        placeholder="Enter credits"
                      />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddCourse}>
                      💾 Submit Course
                    </button>
                  </div>
                </div>
              ) : modalContent.title === 'Student Allocation' ? (
                <div className="student-allocation">
                  <div className="allocation-stats">
                    <div className="allocation-item">
                      <h4>👥 Total Students Allocated</h4>
                      <p className="stat-number">120</p>
                    </div>
                    <div className="allocation-item boys">
                      <h4>👦 Boys</h4>
                      <p className="stat-number">68</p>
                      <span className="percentage">56.7%</span>
                    </div>
                    <div className="allocation-item girls">
                      <h4>👧 Girls</h4>
                      <p className="stat-number">52</p>
                      <span className="percentage">43.3%</span>
                    </div>
                  </div>
                  <div className="gender-chart">
                    <h4>📊 Gender Distribution</h4>
                    <div className="chart-bars">
                      <div className="chart-bar">
                        <div className="bar-fill boys-bar" style={{height: '68%'}}></div>
                        <span>Boys (68)</span>
                      </div>
                      <div className="chart-bar">
                        <div className="bar-fill girls-bar" style={{height: '52%'}}></div>
                        <span>Girls (52)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : modalContent.courses.length === 0 && modalContent.title !== 'Student Allocation' ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h3>No courses found</h3>
                  <p>No newly added courses to display.</p>
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

export default Admin;