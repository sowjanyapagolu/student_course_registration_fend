import React, { useState, useEffect } from 'react';

const Courses = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [processingIds, setProcessingIds] = useState(new Set());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: '', code: '', description: '', instructor: '', schedule: '', credits: '' });

  useEffect(() => { fetchCourses(); if (!isAdmin) fetchEnrollments(); }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try { const res = await fetch('http://localhost:8080/courses'); setCourses(await res.json()); }
    catch (err) { setMessage('❌ Failed to load courses'); }
    finally { setLoading(false); }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`http://localhost:8080/enrollments/student/${user.id}`);
      const data = await res.json();
      setEnrolledIds(new Set(data.filter(e => e.status === 'ENROLLED').map(e => e.course.id)));
    } catch (err) { console.error(err); }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.code || !newCourse.credits) { setMessage('❌ Please fill required fields'); return; }
    try {
      const res = await fetch(`http://localhost:8080/admin/courses?adminId=${user.id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName: newCourse.name, code: newCourse.code, description: newCourse.description, instructor: newCourse.instructor, schedule: newCourse.schedule, credits: parseInt(newCourse.credits) })
      });
      const saved = await res.json();
      setCourses([...courses, saved]);
      setMessage('✅ Course added');
      setTimeout(() => setMessage(''), 3000);
      setNewCourse({ name: '', code: '', description: '', instructor: '', schedule: '', credits: '' });
      setShowAddForm(false);
    } catch (err) { setMessage('❌ Failed to add course'); }
  };

  const handleEnroll = async (course) => {
    setProcessingIds(prev => new Set(prev).add(course.id));
    try {
      const res = await fetch(`http://localhost:8080/enrollments/enroll?studentId=${user.id}&courseId=${course.id}`, { method: 'POST' });
      if (!res.ok) throw new Error();
      setEnrolledIds(prev => new Set(prev).add(course.id));
      setMessage(`✅ Enrolled in ${course.courseName}`);
      setTimeout(() => setMessage(''), 3000);
    } catch { setMessage('❌ Enrollment failed.'); setTimeout(() => setMessage(''), 3000); }
    finally { setProcessingIds(prev => { const s = new Set(prev); s.delete(course.id); return s; }); }
  };

  const handleUnenroll = async (course) => {
    if (!window.confirm(`Are you sure you want to unenroll from "${course.courseName}"?`)) return;
    setProcessingIds(prev => new Set(prev).add(course.id));
    try {
      const res = await fetch(`http://localhost:8080/enrollments/remove?studentId=${user.id}&courseId=${course.id}`, { method: 'PUT' });
      if (!res.ok) throw new Error();
      setEnrolledIds(prev => { const s = new Set(prev); s.delete(course.id); return s; });
      setMessage(`✅ Unenrolled from ${course.courseName}`);
      setTimeout(() => setMessage(''), 3000);
    } catch { setMessage('❌ Unenroll failed.'); setTimeout(() => setMessage(''), 3000); }
    finally { setProcessingIds(prev => { const s = new Set(prev); s.delete(course.id); return s; }); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📚 Available Courses</h1>
        {isAdmin && <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? 'Cancel' : 'Add Course'}</button>}
      </div>

      {message && <div className="alert">{message}</div>}

      {isAdmin && showAddForm && (
        <form onSubmit={handleAddCourse} className="auth-form" style={{marginBottom:'30px'}}>
          <div className="form-group"><input placeholder="Course Name *" value={newCourse.name} onChange={(e) => setNewCourse({...newCourse, name: e.target.value})} /></div>
          <div className="form-group"><input placeholder="Course Code *" value={newCourse.code} onChange={(e) => setNewCourse({...newCourse, code: e.target.value})} /></div>
          <div className="form-group"><input placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} /></div>
          <div className="form-group"><input placeholder="Instructor" value={newCourse.instructor} onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})} /></div>
          <div className="form-group"><input placeholder="Schedule" value={newCourse.schedule} onChange={(e) => setNewCourse({...newCourse, schedule: e.target.value})} /></div>
          <div className="form-group"><input type="number" placeholder="Credits *" value={newCourse.credits} onChange={(e) => setNewCourse({...newCourse, credits: e.target.value})} /></div>
          <button type="submit" className="btn btn-primary">Save Course</button>
        </form>
      )}

      {loading && <p>Loading...</p>}

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className={`course-card ${enrolledIds.has(course.id) ? 'selected' : ''}`}>
            <div className="course-header">
              <h3>{course.courseName}</h3>
              <span className="course-code">{course.code}</span>
            </div>
            <div className="course-details">
              {course.description && <p><strong>Description:</strong> {course.description}</p>}
              {course.instructor && <p><strong>Instructor:</strong> {course.instructor}</p>}
              <p><strong>Credits:</strong> {course.credits}</p>
              {course.schedule && <p><strong>Schedule:</strong> {course.schedule}</p>}
            </div>
            {!isAdmin && (
              enrolledIds.has(course.id) ? (
                <button className="btn btn-danger" disabled={processingIds.has(course.id)} onClick={() => handleUnenroll(course)}>
                  {processingIds.has(course.id) ? 'Processing...' : 'Unenroll'}
                </button>
              ) : (
                <button className="btn btn-primary" disabled={processingIds.has(course.id)} onClick={() => handleEnroll(course)}>
                  {processingIds.has(course.id) ? 'Processing...' : 'Enroll'}
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
