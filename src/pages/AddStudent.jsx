import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) { setMessage('❌ Please fill all fields'); return; }
    try {
      const res = await fetch('http://localhost:8080/students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      await res.json();
      setMessage('✅ Student added successfully!');
      setFormData({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/students'), 1500);
    } catch (err) { setMessage('❌ Failed to add student.'); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h1>➕ Add New Student</h1></div>
      {message && <div className="error-message" style={{background: message.startsWith('✅') ? '#d4edda' : '#fee2e2', color: message.startsWith('✅') ? '#155724' : '#dc2626'}}>{message}</div>}
      <div style={{maxWidth:'500px', background:'white', padding:'30px', borderRadius:'12px', boxShadow:'0 2px 10px rgba(0,0,0,0.08)'}}>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group"><label>Full Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Enter student name" /></div>
          <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="Enter email" /></div>
          <div className="form-group"><label>Password</label><input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Enter password" /></div>
          <button type="submit" className="btn btn-primary" style={{width:'100%', marginTop:'10px'}}>💾 Add Student</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
