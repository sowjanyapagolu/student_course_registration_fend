import React, { useState, useEffect } from 'react';

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [systemStats, setSystemStats] = useState({ totalUsers: 0, totalCourses: 0, myCoursesAdded: 0 });
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', courses: [] });
  const [newCourse, setNewCourse] = useState({ name: '', code: '', credits: '', instructor: '', schedule: '' });
  const [myAddedCourses, setMyAddedCourses] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchMyAddedCourses();
  }, []);

  const fetchStats = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        fetch('http://localhost:8080/students'),
        fetch('http://localhost:8080/courses')
      ]);
      const students = await studentsRes.json();
      const courses = await coursesRes.json();
      setSystemStats(prev => ({ ...prev, totalUsers: students.length, totalCourses: courses.length }));
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchMyAddedCourses = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/courses/by/${user.id}`);
      const data = await res.json();
      const names = data.coursesAdded ? data.coursesAdded.split(',').filter(c => c.trim()) : [];
      setMyAddedCourses(names);
      setSystemStats(prev => ({ ...prev, myCoursesAdded: names.length }));
    } catch (err) {
      console.error('Failed to fetch admin courses', err);
    }
  };

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.code || !newCourse.credits) {
      alert('Please fill name, code and credits');
      return;
    }
    try {
      const res = await fetch(`http://localhost:8080/admin/courses?adminId=${user.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseName: newCourse.name,
          code: newCourse.code,
          credits: parseInt(newCourse.credits),
          instructor: newCourse.instructor,
          schedule: newCourse.schedule
        })
      });
      const saved = await res.json();
      setNewCourse({ name: '', code: '', credits: '', instructor: '', schedule: '' });
      setShowModal(false);
      fetchStats();
      fetchMyAddedCourses();
      alert(`✅ Course "${saved.courseName}" added successfully!`);
    } catch (err) {
      alert('❌ Failed to add course. Is Spring Boot running?');
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-welcome-banner">
        <div className="admin-welcome-content">
          <h1 className="admin-welcome-title">⚙️ Admin Control Center</h1>
          <p className="admin-welcome-subtitle">Manage the entire system with powerful administrative tools 📊</p>
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
            <p>Total Students</p>
            <div className="stat-progress"><div className="progress-bar" style={{width: '100%'}}></div></div>
          </div>
          <div className="card-glow red-glow"></div>
        </div>

        <div className="admin-colorful-stat-card blue">
          <div className="stat-icon-large">📚</div>
          <div className="stat-content">
            <h3>{systemStats.totalCourses}</h3>
            <p>Total Courses</p>
            <div className="stat-progress"><div className="progress-bar" style={{width: '100%'}}></div></div>
          </div>
          <div className="card-glow blue-glow"></div>
        </div>

        <div className="admin-colorful-stat-card green">
          <div className="stat-icon-large">📋</div>
          <div className="stat-content">
            <h3>{systemStats.totalUsers}</h3>
            <p>Active Registrations</p>
            <div className="stat-progress"><div className="progress-bar" style={{width: '80%'}}></div></div>
          </div>
          <div className="card-glow green-glow"></div>
        </div>

        <div className="admin-colorful-stat-card purple" onClick={() => { setModalContent({title: 'My Added Courses', courses: myAddedCourses}); setShowModal(true); }} style={{cursor: 'pointer'}}>
          <div className="stat-icon-large">✨</div>
          <div className="stat-content">
            <h3>{systemStats.myCoursesAdded}</h3>
            <p>My Added Courses</p>
            <div className="stat-progress"><div className="progress-bar" style={{width: '75%'}}></div></div>
          </div>
          <div className="card-glow purple-glow"></div>
        </div>
      </div>

      <div className="admin-sections">
        <div className="admin-management-card">
          <h3>🛠️ System Management</h3>
          <div className="admin-action-grid">
            <button className="admin-action-btn red-admin-btn" onClick={() => { setModalContent({title: 'Manage Courses', courses: []}); setShowModal(true); }}>
              <span>📚</span>
              <div><strong>Manage Courses</strong><p>Add, edit, delete courses</p></div>
            </button>
            <button className="admin-action-btn blue-admin-btn" onClick={() => { setModalContent({title: 'Student Allocation', courses: []}); setShowModal(true); }}>
              <span>👥</span>
              <div><strong>Student Allocation</strong><p>View assigned students & demographics</p></div>
            </button>
            <button className="admin-action-btn green-admin-btn">
              <span>📊</span>
              <div><strong>View Reports</strong><p>Analytics & statistics</p></div>
            </button>
            <button className="admin-action-btn purple-admin-btn" onClick={() => { setModalContent({title: 'My Added Courses', courses: myAddedCourses}); setShowModal(true); }}>
              <span>✨</span>
              <div><strong>My Added Courses</strong><p>View courses you added</p></div>
            </button>
          </div>
        </div>

        <div className="admin-activity-card">
          <h3>📊 Recent System Activity</h3>
          <div className="activity-timeline">
            <div className="activity-item success">
              <div className="activity-icon">✅</div>
              <div className="activity-content"><strong>System Health Check</strong><p>All systems operational - 2 min ago</p></div>
            </div>
            <div className="activity-item info">
              <div className="activity-icon">👤</div>
              <div className="activity-content"><strong>User Login</strong><p>Admin logged in successfully - 5 min ago</p></div>
            </div>
            <div className="activity-item warning">
              <div className="activity-icon">⚠️</div>
              <div className="activity-content"><strong>Database Backup</strong><p>Scheduled backup completed - 1 hour ago</p></div>
            </div>
            <div className="activity-item success">
              <div className="activity-icon">📚</div>
              <div className="activity-content"><strong>Course Registration</strong><p>New course enrollment - 2 hours ago</p></div>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-tools-section">
        <div className="admin-tools-card">
          <h3>🚀 Advanced Tools</h3>
          <div className="tools-grid">
            <div className="tool-item"><div className="tool-icon">📊</div><h4>Analytics Dashboard</h4><p>Detailed system metrics</p></div>
            <div className="tool-item"><div className="tool-icon">🔒</div><h4>Security Center</h4><p>Monitor system security</p></div>
            <div className="tool-item"><div className="tool-icon">💾</div><h4>Backup Manager</h4><p>Data backup & recovery</p></div>
            <div className="tool-item"><div className="tool-icon">📧</div><h4>Notification Center</h4><p>System alerts & messages</p></div>
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
                      <input type="text" value={newCourse.name} onChange={(e) => setNewCourse({...newCourse, name: e.target.value})} placeholder="Enter course name" />
                    </div>
                    <div className="form-group">
                      <label>Course Code</label>
                      <input type="text" value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value})} placeholder="Enter course code" />
                    </div>
                    <div className="form-group">
                      <label>Instructor</label>
                      <input type="text" value={newCourse.instructor} onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})} placeholder="Enter instructor" />
                    </div>
                    <div className="form-group">
                      <label>Schedule</label>
                      <input type="text" value={newCourse.schedule} onChange={(e) => setNewCourse({...newCourse, schedule: e.target.value})} placeholder="e.g. Mon/Wed 10:00-11:30" />
                    </div>
                    <div className="form-group">
                      <label>Credits</label>
                      <input type="number" value={newCourse.credits} onChange={(e) => setNewCourse({...newCourse, credits: e.target.value})} placeholder="Enter credits" />
                    </div>
                    <button className="btn btn-primary" onClick={handleAddCourse}>💾 Submit Course</button>
                  </div>
                </div>
              ) : modalContent.title === 'My Added Courses' ? (
                myAddedCourses.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">📭</div><h3>No courses added yet</h3><p>Add courses using Manage Courses.</p></div>
                ) : (
                  <div className="courses-list">
                    {myAddedCourses.map((name, i) => (
                      <div key={i} className="course-item">
                        <div className="course-info"><h4>📚 {name.trim()}</h4></div>
                      </div>
                    ))}
                  </div>
                )
              ) : modalContent.title === 'Student Allocation' ? (
                <div className="student-allocation">
                  <div className="allocation-stats">
                    <div className="allocation-item"><h4>👥 Total Students</h4><p className="stat-number">{systemStats.totalUsers}</p></div>
                    <div className="allocation-item boys"><h4>👦 Boys</h4><p className="stat-number">68</p><span className="percentage">56.7%</span></div>
                    <div className="allocation-item girls"><h4>👧 Girls</h4><p className="stat-number">52</p><span className="percentage">43.3%</span></div>
                  </div>
                  <div className="gender-chart">
                    <h4>📊 Gender Distribution</h4>
                    <div className="chart-bars">
                      <div className="chart-bar"><div className="bar-fill boys-bar" style={{height: '68%'}}></div><span>Boys (68)</span></div>
                      <div className="chart-bar"><div className="bar-fill girls-bar" style={{height: '52%'}}></div><span>Girls (52)</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state"><div className="empty-icon">📭</div><h3>No data found</h3></div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
