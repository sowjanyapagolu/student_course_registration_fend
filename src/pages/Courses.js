import React, { useState, useEffect } from 'react';

const Courses = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user && user.role === 'admin';

  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [processingIds, setProcessingIds] = useState(new Set());
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
    if (!isAdmin && user?.id) fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8080/courses');
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      setMessage('❌ Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch(`http://localhost:8080/enrollments/student/${user.id}`);
      const data = await res.json();
      const ids = new Set(data.filter(e => e.status === 'ENROLLED').map(e => e.course.id));
      setEnrolledIds(ids);
    } catch (err) {
      console.error('Failed to fetch enrollments', err);
    }
  };

  const handleEnroll = async (course) => {
    setProcessingIds(prev => new Set(prev).add(course.id));
    try {
      const res = await fetch(
        `http://localhost:8080/enrollments/enroll?studentId=${user.id}&courseId=${course.id}`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error();
      setEnrolledIds(prev => new Set(prev).add(course.id));
      setMessage(`✅ Enrolled in ${course.courseName}`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Enrollment failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setProcessingIds(prev => { const s = new Set(prev); s.delete(course.id); return s; });
    }
  };

  const handleUnenroll = async (course) => {
    const confirmed = window.confirm(`Are you sure you want to unenroll from "${course.courseName}"?`);
    if (!confirmed) return;

    setProcessingIds(prev => new Set(prev).add(course.id));
    try {
      const res = await fetch(
        `http://localhost:8080/enrollments/remove?studentId=${user.id}&courseId=${course.id}`,
        { method: 'PUT' }
      );
      if (!res.ok) throw new Error();
      setEnrolledIds(prev => { const s = new Set(prev); s.delete(course.id); return s; });
      setMessage(`✅ Unenrolled from ${course.courseName}`);
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('❌ Unenroll failed. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setProcessingIds(prev => { const s = new Set(prev); s.delete(course.id); return s; });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Available Courses</h1>
        <p>Select courses to add to your schedule</p>
      </div>

      {message && <div className="error-message" style={{ background: message.startsWith('✅') ? '#d4edda' : '#fee2e2', color: message.startsWith('✅') ? '#155724' : '#dc2626' }}>{message}</div>}
      {loading && <p>Loading courses...</p>}

      <div className="courses-grid">
        {courses.map(course => (
          <div key={course.id} className={`course-card ${enrolledIds.has(course.id) ? 'selected' : ''}`}>
            <div className="course-header">
              <h3>{course.courseName}</h3>
              <span className="course-code">{course.code}</span>
            </div>
            <div className="course-details">
              {course.instructor && <p><strong>Instructor:</strong> {course.instructor}</p>}
              <p><strong>Credits:</strong> {course.credits}</p>
              {course.schedule && <p><strong>Schedule:</strong> {course.schedule}</p>}
              {course.description && <p><strong>Description:</strong> {course.description}</p>}
            </div>
            {!isAdmin && (
              enrolledIds.has(course.id) ? (
                <button
                  className="btn btn-danger"
                  disabled={processingIds.has(course.id)}
                  onClick={() => handleUnenroll(course)}
                >
                  {processingIds.has(course.id) ? 'Processing...' : 'Unenroll'}
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  disabled={processingIds.has(course.id)}
                  onClick={() => handleEnroll(course)}
                >
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
