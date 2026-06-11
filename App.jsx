import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home              from './pages/Home';
import Login             from './pages/Login';
import Signup            from './pages/Signup';
import SeekerDashboard   from './pages/SeekerDashboard';
import EmployerDashboard from './pages/EmployerDashboard';
import AdminDashboard    from './pages/AdminDashboard';


function ProtectedRoute({ children, role }) {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/login" />;
  if (role && user.role.toUpperCase() !== role.toUpperCase()) {
  return <Navigate to="/login" />;
}
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/login"   element={<Login />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/seeker"
          element={<ProtectedRoute role="JOBSEEKER"><SeekerDashboard /></ProtectedRoute>} />
        <Route path="/employer"
          element={<ProtectedRoute role="EMPLOYER"><EmployerDashboard /></ProtectedRoute>} />
        <Route path="/admin"
          element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;