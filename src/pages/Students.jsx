import React, { useState, useEffect } from 'react';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    setLoading(true);
    try { const res = await fetch('http://localhost:8080/students'); setStudents(await res.json()); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try { await fetch(`http://localhost:8080/students/${id}`, { method: 'DELETE' }); setStudents(prev => prev.filter(s => s.id !== id)); }
    catch (err) { alert('❌ Failed to delete.'); }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🎓 All Students</h1>
        <button className="btn btn-primary" onClick={fetchStudents}>🔄 Refresh</button>
      </div>
      {loading && <p>Loading...</p>}
      {!loading && students.length === 0 && <div className="empty-state"><div className="empty-icon">📭</div><h3>No students found</h3></div>}
      {students.length > 0 && (
        <div className="schedule-table">
          <table>
            <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Courses Selected</th><th>Action</th></tr></thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={s.id}>
                  <td>{i+1}</td><td>{s.name}</td><td>{s.email}</td><td>{s.coursesSelected || 'None'}</td>
                  <td><button className="btn btn-small btn-danger" onClick={() => handleDelete(s.id)}>🗑 Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Students;
