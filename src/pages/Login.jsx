import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    { name: 'red', value: '#dc2626' }, { name: 'blue', value: '#2563eb' },
    { name: 'black', value: '#1f2937' }, { name: 'lavender', value: '#8b5cf6' },
    { name: 'green', value: '#16a34a' }, { name: 'white', value: '#f8fafc' },
    { name: 'pink', value: '#ec4899' }, { name: 'yellow', value: '#eab308' }
  ];

  useEffect(() => { generateCaptcha(); }, [formData.role]);

  const applyTheme = (color) => {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--bg-color', color);
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
    setCaptcha(result);
  };

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const resetForm = () => { setFormData({ name: '', email: '', password: '', role: 'student' }); setCaptchaInput(''); generateCaptcha(); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { setError('Please fill in all fields'); return; }
    if (captcha !== captchaInput) { setError('Invalid captcha.'); generateCaptcha(); setCaptchaInput(''); return; }

    if (isLogin) {
      const url = formData.role === 'admin' ? 'http://localhost:8080/admin/login' : 'http://localhost:8080/students/login';
      try {
        const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: formData.email, password: formData.password }) });
        const data = await res.json();
        if (formData.role === 'admin') {
          if (!data || data.success === false) { setError('Invalid admin credentials'); return; }
          sessionStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: 'admin' }));
          navigate('/admin');
        } else {
          if (data && data.id) {
            sessionStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: 'student' }));
            navigate('/dashboard');
          } else { setError('Invalid credentials. Please register first.'); }
        }
      } catch (err) { setError('Cannot reach backend. Is Spring Boot running?'); }
    } else {
      if (!formData.name) { setError('Please enter your name'); return; }
      const endpoint = formData.role === 'admin' ? 'http://localhost:8080/admin' : 'http://localhost:8080/students';
      try {
        const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }) });
        await res.json();
        setError('Registration successful! Please login.');
        setIsLogin(true);
        resetForm();
      } catch (err) { setError('Registration failed. Is Spring Boot running?'); }
    }
  };

  return (
    <div className="auth-container">
      <div className="color-picker-toggle" onClick={() => setShowColorPicker(!showColorPicker)}>🎨</div>
      {showColorPicker && (
        <div className="color-picker-panel">
          <div className="color-grid">
            {colors.map(color => (
              <div key={color.name} className="color-option" style={{ backgroundColor: color.value }}
                onClick={() => { applyTheme(color.value); setShowColorPicker(false); }} title={color.name} />
            ))}
          </div>
        </div>
      )}

      {/* Falling Emojis */}
      <div className="emoji-fall-1">📚</div>
      <div className="emoji-fall-2">🎓</div>
      <div className="emoji-fall-3">✏️</div>
      <div className="emoji-fall-4">📝</div>
      <div className="emoji-fall-5">💡</div>
      <div className="emoji-fall-6">🏆</div>
      <div className="emoji-fall-7">⭐</div>

      <div className="auth-card">
        <h1>Course Registration System</h1>
        <div className="auth-toggle">
          <button className={`toggle-btn ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); resetForm(); }}>Login</button>
          <button className={`toggle-btn ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); resetForm(); }}>Register</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Login As</label>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Captcha</label>
            <div className="captcha-container">
              <div className="captcha-display">{captcha}</div>
              <button type="button" onClick={generateCaptcha}>🔄</button>
            </div>
            <input value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Enter captcha" />
          </div>
          <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
