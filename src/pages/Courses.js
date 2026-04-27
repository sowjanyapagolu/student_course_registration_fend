import React, { useState, useEffect } from 'react';

const availableCourses = [
  { id: 1, name: 'Data Structures', code: 'CS201', credits: 4, instructor: 'Dr. Smith', schedule: 'Mon/Wed 10:00-11:30' },
  { id: 2, name: 'Database Systems', code: 'CS301', credits: 3, instructor: 'Dr. Johnson', schedule: 'Tue/Thu 14:00-15:30' },
  { id: 3, name: 'Web Development', code: 'CS302', credits: 3, instructor: 'Prof. Williams', schedule: 'Mon/Wed 14:00-15:30' },
  { id: 4, name: 'Operating Systems', code: 'CS303', credits: 4, instructor: 'Dr. Brown', schedule: 'Tue/Thu 10:00-11:30' },
  { id: 5, name: 'Computer Networks', code: 'CS304', credits: 3, instructor: 'Prof. Davis', schedule: 'Mon/Wed 16:00-17:30' },
  { id: 6, name: 'Software Engineering', code: 'CS401', credits: 4, instructor: 'Dr. Miller', schedule: 'Tue/Thu 16:00-17:30' },
  { id: 7, name: 'Machine Learning', code: 'CS402', credits: 4, instructor: 'Dr. Wilson', schedule: 'Mon/Wed 10:00-11:30' },
  { id: 8, name: 'Artificial Intelligence', code: 'CS403', credits: 4, instructor: 'Prof. Moore', schedule: 'Tue/Thu 14:00-15:30' }
];

const Courses = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('selectedCourses')) || [];
    setSelectedCourses(saved);
  }, []);
  
  const handleCourseToggle = (course) => {
    let updated;
    if (selectedCourses.find(c => c.id === course.id)) {
      updated = selectedCourses.filter(c => c.id !== course.id);
    } else {
      updated = [...selectedCourses, course];
    }
    setSelectedCourses(updated);
    localStorage.setItem('selectedCourses', JSON.stringify(updated));
  };
  
  const isCourseSelected = (courseId) => selectedCourses.some(c => c.id === courseId);
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Available Courses</h1>
        <p>Select courses to add to your schedule</p>
      </div>
      <div className="courses-grid">
        {availableCourses.map(course => (
          <div key={course.id} className={`course-card ${isCourseSelected(course.id) ? 'selected' : ''}`}>
            <div className="course-header">
              <h3>{course.name}</h3>
              <span className="course-code">{course.code}</span>
            </div>
            <div className="course-details">
              <p><strong>Instructor:</strong> {course.instructor}</p>
              <p><strong>Credits:</strong> {course.credits}</p>
              <p><strong>Schedule:</strong> {course.schedule}</p>
            </div>
            <button onClick={() => handleCourseToggle(course)} className={`btn ${isCourseSelected(course.id) ? 'btn-danger' : 'btn-primary'}`}>
              {isCourseSelected(course.id) ? 'Remove Course' : 'Add Course'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
