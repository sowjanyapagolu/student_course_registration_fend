import React, { useState } from 'react';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });

  const handleSave = () => {
    const updated = { ...user, name: formData.name, email: formData.email };
    localStorage.setItem('user', JSON.stringify(updated));
    setIsEditing(false);
    alert('✅ Profile updated!');
  };

  return (
    <div className="page-container profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">{user?.name?.charAt(0).toUpperCase()}</div>
        </div>
        <div className="profile-title">
          <h1>{user?.name}</h1>
          <p className="profile-role">{user?.role}</p>
        </div>
        <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>👤 Personal Information</h2>
          <div className="profile-grid">
            <div className="profile-field">
              <label>Full Name</label>
              {isEditing ? (
                <input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              ) : (
                <p>{user?.name}</p>
              )}
            </div>
            <div className="profile-field">
              <label>Email</label>
              {isEditing ? (
                <input value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              ) : (
                <p>{user?.email}</p>
              )}
            </div>
            <div className="profile-field">
              <label>Role</label>
              <p>{user?.role}</p>
            </div>
            <div className="profile-field">
              <label>Status</label>
              <p>Active</p>
            </div>
          </div>
          {isEditing && (
            <button className="btn btn-primary" onClick={handleSave} style={{marginTop: '20px'}}>
              💾 Save Changes
            </button>
          )}
        </div>

        {user?.role === 'student' && (
          <div className="profile-section">
            <h2>📊 Academic Summary</h2>
            <div className="credit-summary">
              <div className="credit-card">
                <div className="credit-icon">📚</div>
                <div className="credit-info"><h3>Spring 2024</h3><p>Current Semester</p></div>
              </div>
              <div className="credit-card">
                <div className="credit-icon">⭐</div>
                <div className="credit-info"><h3>3.5</h3><p>CGPA</p></div>
              </div>
              <div className="credit-card">
                <div className="credit-icon">🎓</div>
                <div className="credit-info"><h3>60</h3><p>Credits Completed</p></div>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'admin' && (
          <div className="profile-section">
            <h2>🔑 Admin Privileges</h2>
            <div className="admin-privileges">
              <div className="privilege-item">✅ Manage Courses</div>
              <div className="privilege-item">✅ View All Students</div>
              <div className="privilege-item">✅ Add/Delete Courses</div>
              <div className="privilege-item">✅ System Reports</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
