import React, { useState, useEffect } from 'react';

const CourseReport = () => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        fetch('http://localhost:8080/courses'),
        fetch('http://localhost:8080/students')
      ]);
      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();
      setCourses(coursesData);
      setEnrollments(studentsData);
    } catch (err) {
      console.error('Failed to fetch report data', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Course Report</h1>
        <button className="btn btn-primary" onClick={fetchData}>🔄 Refresh</button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="report-table-section" style={{ marginBottom: '30px' }}>
        <div className="report-table-header purple-header">
          <h2>📚 All Courses</h2>
          <span className="badge">{courses.length} Courses</span>
        </div>
        <div className="schedule-table">
          <table>
            <thead>
              <tr><th>#</th><th>Course Name</th><th>Code</th><th>Instructor</th><th>Schedule</th><th>Credits</th></tr>
            </thead>
            <tbody>
              {courses.map((c, i) => (
                <tr key={c.id}>
                  <td>{i + 1}</td>
                  <td>{c.courseName}</td>
                  <td><span className="credit-badge">{c.code}</span></td>
                  <td>{c.instructor || '-'}</td>
                  <td>{c.schedule || '-'}</td>
                  <td>{c.credits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="report-table-section">
        <div className="report-table-header green-header">
          <h2>🎓 Student Enrollments</h2>
          <span className="badge">{enrollments.length} Students</span>
        </div>
        <div className="schedule-table">
          <table>
            <thead>
              <tr><th>#</th><th>Student Name</th><th>Email</th><th>Courses Selected</th></tr>
            </thead>
            <tbody>
              {enrollments.map((s, i) => (
                <tr key={s.id}>
                  <td>{i + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.coursesSelected || 'None'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseReport;
