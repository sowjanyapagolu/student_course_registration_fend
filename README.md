# Online Student Course Selection and Scheduling Platform

A professional React-based web application for managing student course registration and scheduling.

## Features

- **Role-Based Authentication**: Separate login for Students and Admins
- **Course Management**: Browse and select from available courses
- **Schedule Management**: View and manage registered courses
- **Admin Panel**: Admin-only access for system management
- **Protected Routes**: Secure routing with authentication checks
- **Persistent Storage**: LocalStorage for user data and course selections
- **Professional UI**: Clean, academic-style dashboard layout

## Tech Stack

- React 18
- React Router v6
- Custom CSS (No external UI libraries)
- LocalStorage for state persistence

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open (http://localhost:5174) in your browser

## Build for Production

```bash
npm run build
```

## Deployment on Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

```
src/
  components/
    Layout.js          - Main layout wrapper
    Sidebar.js         - Navigation sidebar
    ProtectedRoute.js  - Route authentication
  pages/
    Login.js           - Login page
    Register.js        - Registration page
    Dashboard.js       - Main dashboard
    Courses.js         - Course selection
    Schedule.js        - Student schedule
    Admin.js           - Admin panel
  App.js              - Main app component
  index.js            - Entry point
  styles.css          - Global styles
```

## Usage

### Student Flow
1. Register or Login as Student
2. Browse available courses
3. Select courses to register
4. View schedule with registered courses

### Admin Flow
1. Login as Admin
2. Access Admin Panel
3. View system statistics
4. Manage courses and users

## Features Implemented

✅ Role-based authentication (Student/Admin)
✅ Protected routes with authorization
✅ Course selection and management
✅ Schedule display
✅ Dashboard with statistics
✅ Logout functionality
✅ LocalStorage persistence
✅ Professional UI design
✅ Responsive layout
✅ Clean code structure

## License

MIT
