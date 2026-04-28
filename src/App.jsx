import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Courses from './pages/Courses.jsx';
import Schedule from './pages/Schedule.jsx';
import Admin from './pages/Admin.jsx';
import Profile from './pages/Profile.jsx';
import Students from './pages/Students.jsx';
import AddStudent from './pages/AddStudent.jsx';
import CourseReport from './pages/CourseReport.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><Layout><Courses /></Layout></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute><Layout><Schedule /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly={true}><Layout><Admin /></Layout></ProtectedRoute>} />
        <Route path="/students" element={<ProtectedRoute adminOnly={true}><Layout><Students /></Layout></ProtectedRoute>} />
        <Route path="/add-student" element={<ProtectedRoute adminOnly={true}><Layout><AddStudent /></Layout></ProtectedRoute>} />
        <Route path="/course-report" element={<ProtectedRoute adminOnly={true}><Layout><CourseReport /></Layout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
