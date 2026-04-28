import React, { useState, useEffect } from 'react';

const Schedule = () => {
  const user = JSON.parse(sessionStorage.getItem('user'));
  const [courses, setCourses] = useState([]);

  useEffect(() => { fetchEnrolled(); }, []);

  const fetchEnrolled = async () => {
    try {
      const res = await fetch(`http://localhost:8080/enrollments/student/${user.id}`);
      const data = await res.json();
      setCourses(data.filter(e => e.status === 'ENROLLED'));
    } catch (err) { console.error(err); }
  };

  const handleRemove = async (courseId) => {
    if (!window.confirm('Remove this course from schedule?')) return;
    try {
      await fetch(`http://localhost:8080/enrollments/remove?studentId=${user.id}&courseId=${courseId}`, { method: 'PUT' });
      setCourses(prev => prev.filter(e => e.course.id !== courseId));
    } catch (err) { alert('Failed to remove course'); }
  };

  const totalCredits = courses.reduce((sum, e) => sum + (e.course?.credits || 0), 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📅 My Schedule</h1>
        <p>Your registered courses for this semester</p>
      </div>
      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No Courses Selected</h3>
          <p>Visit the Courses page to enroll in courses.</p>
        </div>
      ) : (
        <>
          <div className="schedule-summary">
            <div className="summary-card"><h3>Total Courses: {courses.length}</h3></div>
            <div className="summary-card"><h3>Total Credits: {totalCredits}</h3></div>
          </div>
          <div className="schedule-table">
            <table>
              <thead>
                <tr><th>Course Code</th><th>Course Name</th><th>Instructor</th><th>Schedule</th><th>Credits</th><th>Action</th></tr>
              </thead>
              <tbody>
                {courses.map(e => (
                  <tr key={e.id}>
                    <td>{e.course?.code}</td>
                    <td>{e.course?.courseName}</td>
                    <td>{e.course?.instructor || '-'}</td>
                    <td>{e.course?.schedule || '-'}</td>
                    <td>{e.course?.credits}</td>
                    <td><button className="btn btn-small btn-danger" onClick={() => handleRemove(e.course.id)}>Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;
