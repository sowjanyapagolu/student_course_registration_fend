import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaInput, setMfaInput] = useState('');
  const [error, setError] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const colors = [
    { name: 'red', value: '#dc2626' },
    { name: 'blue', value: '#2563eb' },
    { name: 'black', value: '#1f2937' },
    { name: 'lavender', value: '#8b5cf6' },
    { name: 'green', value: '#16a34a' },
    { name: 'white', value: '#f8fafc' },
    { name: 'pink', value: '#ec4899' },
    { name: 'yellow', value: '#eab308' }
  ];

  useEffect(() => {
    generateCaptcha();
    if (formData.role === 'admin') {
      generateMFA();
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, [formData.role]);

  const applyTheme = (color) => {
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--bg-color', color);
    localStorage.setItem('theme', color);
  };

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptcha(result);
  };

  const generateMFA = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setMfaCode(code);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    
    // Auto-generate and "send" MFA code when admin enters email
    if (e.target.name === 'email' && formData.role === 'admin' && isLogin && e.target.value) {
      generateMFA();
      setError(`MFA code sent to ${e.target.value}`);
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (captcha !== captchaInput) {
      setError('Invalid captcha. Please try again.');
      generateCaptcha();
      setCaptchaInput('');
      return;
    }

    if (formData.role === 'admin' && isLogin && mfaCode !== mfaInput) {
      setError('Invalid MFA code. Please try again.');
      generateMFA();
      setMfaInput('');
      return;
    }

    if (isLogin) {
      try {
        const url = formData.role === 'admin'
          ? 'http://localhost:8080/admin/login'
          : 'http://localhost:8080/students/login';

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        const data = await res.json();

        if (formData.role === 'admin') {
          if (!data || data.success === false) {
            setError('Invalid admin credentials.');
            return;
          }
          localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: 'admin' }));
          navigate('/admin');
        } else {
          if (!data || !data.id) {
            setError('Invalid credentials. Please register first.');
            return;
          }
          localStorage.setItem('user', JSON.stringify({ id: data.id, name: data.name, email: data.email, role: 'student' }));
          navigate('/dashboard');
        }
      } catch (err) {
        setError('Cannot reach server. Is Spring Boot running?');
      }
    } else {
      if (!formData.name) {
        setError('Please enter your name');
        return;
      }
      try {
        const url = formData.role === 'admin'
          ? 'http://localhost:8080/admin'
          : 'http://localhost:8080/students';

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password })
        });

        await res.json();
        setError('Registration successful! Please login.');
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '', role: 'student' });
        setCaptchaInput('');
        generateCaptcha();
      } catch (err) {
        setError('Registration failed. Is Spring Boot running?');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="color-picker-toggle" onClick={() => setShowColorPicker(!showColorPicker)}>
        🎨
      </div>
      
      {showColorPicker && (
        <div className="color-picker-panel">
          <div className="color-grid">
            {colors.map((color, index) => (
              <div
                key={color.name}
                className="color-option"
                style={{ backgroundColor: color.value }}
                onClick={() => {applyTheme(color.value); setShowColorPicker(false);}}
                title={color.name}
              ></div>
            ))}
          </div>
        </div>
      )}
      
      {/* Individual Emoji Animations */}
      <div className="emoji-fall-1">📚</div>
      <div className="emoji-fall-2">🎓</div>
      <div className="emoji-rotate-1">💡</div>
      <div className="emoji-rotate-2">🏆</div>
      <div className="emoji-static-1">🎯</div>
      <div className="emoji-shake-1">⭐</div>
      <div className="emoji-shake-2">🌈</div>
      
      <div className="animated-shape shape-1 triangle"></div>
      <div className="animated-shape shape-2 rectangle"></div>
      <div className="animated-shape shape-3 circle"></div>
      <div className="animated-shape shape-4 triangle"></div>
      <div className="animated-shape shape-5 rectangle"></div>
      <div className="animated-shape shape-6 circle"></div>
      
      <div className="auth-card">
        <h1>Course Registration System</h1>
        <div className="role-header">
          <div className="role-emoji">
            {formData.role === 'student' ? '🎓' : '👨💼'}
          </div>
          <h2>
            {formData.role === 'student' ? 'Student' : 'Admin'} {isLogin ? 'Login' : 'Register'}
          </h2>
        </div>
        
        <div className="auth-toggle">
          <button 
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {setIsLogin(true); setError(''); setFormData({ name: '', email: '', password: '', role: 'student' }); setCaptchaInput(''); generateCaptcha();}}
          >
            Login
          </button>
          <button 
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {setIsLogin(false); setError(''); setFormData({ name: '', email: '', password: '', role: 'student' }); setCaptchaInput(''); generateCaptcha();}}
          >
            Register
          </button>
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
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter your full name" 
                required 
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              placeholder="Enter your password" 
              required 
            />
          </div>

          <div className="form-group">
            <label>Captcha</label>
            <div className="captcha-container">
              <div className="captcha-display">{captcha}</div>
              <button type="button" className="captcha-refresh" onClick={generateCaptcha}>🔄</button>
            </div>
            <input 
              type="text" 
              value={captchaInput} 
              onChange={(e) => setCaptchaInput(e.target.value)} 
              placeholder="Enter captcha" 
              required 
            />
          </div>

          {formData.role === 'admin' && isLogin && (
            <div className="form-group">
              <label>🔒 MFA Code (Admin Security)</label>
              <div className="mfa-container">
                <div className="mfa-display">
                  <div className="mfa-icon">📧</div>
                  <div className="mfa-info-text">
                    {mfaCode ? `Code: ${mfaCode} (sent to ${formData.email})` : 'Enter email to receive MFA code'}
                  </div>
                  {mfaCode && (
                    <button type="button" className="mfa-refresh" onClick={generateMFA}>🔄</button>
                  )}
                </div>
                <div className="mfa-info">
                  <small>📲 Use the 6-digit code shown above (simulated email)</small>
                </div>
              </div>
              <input 
                type="text" 
                value={mfaInput} 
                onChange={(e) => setMfaInput(e.target.value)} 
                placeholder="Enter 6-digit MFA code" 
                maxLength="6"
                className="mfa-input"
                required 
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;