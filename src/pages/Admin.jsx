import React, { useState, useEffect } from 'react';

const Admin = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [myAddedCourses, setMyAddedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [newCourse, setNewCourse] = useState({ name: '', code: '', instructor: '', schedule: '', credits: '' });

  useEffect(() => { fetchStudents(); fetchCourses(); fetchMyAddedCourses(); }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try { const res = await fetch('http://localhost:8080/students'); setStudents(await res.json()); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchCourses = async () => {
    try { const res = await fetch('http://localhost:8080/courses'); setCourses(await res.json()); }
    catch (err) { console.error(err); }
  };

  const fetchMyAddedCourses = async () => {
    try {
      const res = await fetch(`http://localhost:8080/admin/courses/by/${user.id}`);
      const data = await res.json();
      const names = data.coursesAdded ? data.coursesAdded.split(',').filter(c => c.trim()) : [];
      setMyAddedCourses(names);
    } catch (err) { console.error(err); }
  };

  const handleAddCourse = async () => {
    if (!newCourse.name || !newCourse.code || !newCourse.credits) { alert('Please fill name, code and credits'); return; }
    try {
      const res = await fetch(`http://localhost:8080/admin/courses?adminId=${user.id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName: newCourse.name, code: newCourse.code, instructor: newCourse.instructor, schedule: newCourse.schedule, credits: parseInt(newCourse.credits) })
      });
      const saved = await res.json();
      setCourses(prev => [...prev, saved]);
      setNewCourse({ name: '', code: '', instructor: '', schedule: '', credits: '' });
      setShowModal(false);
      fetchMyAddedCourses();
      alert(`✅ Course "${saved.courseName}" added!`);
    } catch (err) { alert('❌ Failed to add course.'); }
  };

  const handleDeleteStudent = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await fetch(`http://localhost:8080/students/${id}`, { method: 'DELETE' }); setStudents(prev => prev.filter(s => s.id !== id)); }
    catch (err) { alert('❌ Failed to delete student.'); }
  };

  const openModal = (title) => { setModalTitle(title); setShowModal(true); };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-welcome-banner">
        <div className="admin-welcome-content">
          <h1 className="admin-welcome-title">⚙️ Admin Control Center</h1>
          <p className="admin-welcome-subtitle">Manage students, courses and the entire system 📊</p>
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
          <div className="stat-content"><h3>{students.length}</h3><p>Total Students</p><div className="stat-progress"><div className="progress-bar" style={{width:'100%'}}></div></div></div>
          <div className="card-glow red-glow"></div>
        </div>
        <div className="admin-colorful-stat-card blue">
          <div className="stat-icon-large">📚</div>
          <div className="stat-content"><h3>{courses.length}</h3><p>Total Courses</p><div className="stat-progress"><div className="progress-bar" style={{width:'100%'}}></div></div></div>
          <div className="card-glow blue-glow"></div>
        </div>
        <div className="admin-colorful-stat-card green">
          <div className="stat-icon-large">📋</div>
          <div className="stat-content"><h3>{students.length}</h3><p>Active Registrations</p><div className="stat-progress"><div className="progress-bar" style={{width:'80%'}}></div></div></div>
          <div className="card-glow green-glow"></div>
        </div>
        <div className="admin-colorful-stat-card purple" onClick={() => openModal('My Added Courses')} style={{cursor:'pointer'}}>
          <div className="stat-icon-large">✨</div>
          <div className="stat-content"><h3>{myAddedCourses.length}</h3><p>My Added Courses</p><div className="stat-progress"><div className="progress-bar" style={{width:'75%'}}></div></div></div>
          <div className="card-glow purple-glow"></div>
        </div>
      </div>

      {/* Students Table */}
      <div className="students-section">
        <div className="section-header">
          <h2>🎓 All Students</h2>
          <button className="btn btn-primary" onClick={fetchStudents}>🔄 Refresh</button>
        </div>
        {loading && <p className="loading-text">⏳ Loading...</p>}
        {!loading && students.length === 0 && <div className="empty-state"><div className="empty-icon">📭</div><h3>No students yet</h3></div>}
        {students.length > 0 && (
          <div className="schedule-table">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Courses Selected</th><th>Action</th></tr></thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i+1}</td><td>{s.name}</td><td>{s.email}</td><td>{s.coursesSelected || 'None'}</td>
                    <td><button className="btn btn-small btn-danger" onClick={() => handleDeleteStudent(s.id)}>🗑 Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Courses Table */}
      <div className="students-section">
        <div className="section-header">
          <h2>📚 All Courses</h2>
          <button className="btn btn-primary" onClick={() => openModal('Add Course')}>➕ Add Course</button>
        </div>
        {courses.length > 0 && (
          <div className="schedule-table">
            <table>
              <thead><tr><th>#</th><th>Name</th><th>Code</th><th>Instructor</th><th>Schedule</th><th>Credits</th></tr></thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={c.id}><td>{i+1}</td><td>{c.courseName}</td><td>{c.code}</td><td>{c.instructor}</td><td>{c.schedule}</td><td>{c.credits}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Management Actions */}
      <div className="admin-sections">
        <div className="admin-management-card">
          <h3>🛠️ System Management</h3>
          <div className="admin-action-grid">
            <button className="admin-action-btn red-admin-btn" onClick={() => openModal('Add Course')}><span>📚</span><div><strong>Add Course</strong><p>Add new course to DB</p></div></button>
            <button className="admin-action-btn blue-admin-btn" onClick={() => openModal('My Added Courses')}><span>✨</span><div><strong>My Courses</strong><p>Courses I added</p></div></button>
            <button className="admin-action-btn green-admin-btn" onClick={fetchStudents}><span>👥</span><div><strong>Refresh Students</strong><p>Reload from DB</p></div></button>
            <button className="admin-action-btn purple-admin-btn" onClick={() => openModal('Student Allocation')}><span>📊</span><div><strong>Student Stats</strong><p>View demographics</p></div></button>
          </div>
        </div>
        <div className="admin-activity-card">
          <h3>📊 Recent Activity</h3>
          <div className="activity-timeline">
            <div className="activity-item success"><div className="activity-icon">✅</div><div className="activity-content"><strong>System Online</strong><p>All systems operational</p></div></div>
            <div className="activity-item info"><div className="activity-icon">👤</div><div className="activity-content"><strong>Admin Logged In</strong><p>Session active</p></div></div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{modalTitle}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {modalTitle === 'Add Course' && (
                <div className="course-management">
                  <h4>🆕 Add New Course</h4>
                  {[{label:'Course Name *',key:'name'},{label:'Course Code *',key:'code'},{label:'Instructor',key:'instructor'},{label:'Schedule',key:'schedule'},{label:'Credits *',key:'credits'}].map(f => (
                    <div className="form-group" key={f.key}>
                      <label>{f.label}</label>
                      <input type={f.key==='credits'?'number':'text'} value={newCourse[f.key]} onChange={(e) => setNewCourse({...newCourse,[f.key]:e.target.value})} placeholder={f.label} />
                    </div>
                  ))}
                  <button className="btn btn-primary" onClick={handleAddCourse} style={{marginTop:'15px',width:'100%'}}>💾 Save Course</button>
                </div>
              )}
              {modalTitle === 'My Added Courses' && (
                myAddedCourses.length === 0 ? (
                  <div className="empty-state"><div className="empty-icon">📭</div><h3>No courses added yet</h3></div>
                ) : (
                  <div className="courses-list">
                    {myAddedCourses.map((name, i) => (
                      <div key={i} className="course-item"><div className="course-info"><h4>📚 {name.trim()}</h4></div></div>
                    ))}
                  </div>
                )
              )}
              {modalTitle === 'Student Allocation' && (
                <div className="student-allocation">
                  <div className="allocation-stats">
                    <div className="allocation-item"><h4>👥 Total Students</h4><p className="stat-number">{students.length}</p></div>
                    <div className="allocation-item boys"><h4>👦 Boys</h4><p className="stat-number">68</p><span className="percentage">56.7%</span></div>
                    <div className="allocation-item girls"><h4>👧 Girls</h4><p className="stat-number">52</p><span className="percentage">43.3%</span></div>
                  </div>
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
