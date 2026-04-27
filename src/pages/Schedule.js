import React, { useState, useEffect } from 'react';

const Schedule = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    setSelectedCourses(saved);
    const credits = saved.reduce((sum, course) => sum + course.credits, 0);
    setTotalCredits(credits);
  }, []);
  
  const handleRemoveCourse = (courseId) => {
    const updated = selectedCourses.filter(c => c.id !== courseId);
    setSelectedCourses(updated);
    localStorage.setItem('selectedCourses', JSON.stringify(updated));
    const credits = updated.reduce((sum, course) => sum + course.credits, 0);
    setTotalCredits(credits);
  };
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>My Schedule</h1>
        <p>Your registered courses for this semester</p>
      </div>
      {selectedCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No Courses Selected</h3>
          <p>You haven't registered for any courses yet. Visit the Courses page to select courses.</p>
        </div>
      ) : (
        <>
          <div className="schedule-summary">
            <div className="summary-card"><h3>Total Courses: {selectedCourses.length}</h3></div>
            <div className="summary-card"><h3>Total Credits: {totalCredits}</h3></div>
          </div>
          <div className="schedule-table">
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Instructor</th>
                  <th>Schedule</th>
                  <th>Credits</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedCourses.map(course => (
                  <tr key={course.id}>
                    <td>{course.code}</td>
                    <td>{course.name}</td>
                    <td>{course.instructor}</td>
                    <td>{course.schedule}</td>
                    <td>{course.credits}</td>
                    <td><button onClick={() => handleRemoveCourse(course.id)} className="btn btn-small btn-danger">Remove</button></td>
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
