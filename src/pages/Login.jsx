import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper,
         ToggleButton, ToggleButtonGroup } from '@mui/material';

const users = [
  { name:'Krishna Vijayan', email:'krishnavijayan34@gmail.com', password:'1234', role:'seeker' },
  { name:'Rahul Employer', email:'rahul@company.com', password:'1234', role:'employer' },
  { name:'Admin', email:'admin@jobportal.com', password:'admin123', role:'admin' },
];

function Login() {
  const navigate = useNavigate();

  
  const [formData, setFormData] = useState({
    role: 'seeker',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

 
  const handleRoleChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        role: value
      });
    }
  };


  const handleLogin = () => {
    const { email, password, role } = formData;

    if (!email || !password) {
      alert('Fill all fields!');
      return;
    }

    const found = users.find(
      u =>
        u.email === email &&
        u.password === password &&
        u.role === role
    );

    if (!found) {
      alert('Invalid credentials!');
      return;
    }

    localStorage.setItem('user', JSON.stringify(found));

    navigate(
      role === 'seeker'
        ? '/seeker'
        : role === 'employer'
        ? '/employer'
        : '/admin'
    );
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      background: '#eff6ff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, width: 400 }}>

        <Typography variant="h5" fontWeight="bold" textAlign="center" color="#2563eb">
          💼 JobPortal
        </Typography>

        <Typography variant="h6" fontWeight="bold" textAlign="center">
          Welcome Back!
        </Typography>

        <Typography textAlign="center" color="#6b7280" fontSize="13px" mb={3}>
          Select your role and login
        </Typography>

        {/* ROLE SELECTION */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={formData.role}
            exclusive
            size="small"
            onChange={handleRoleChange}
          >
            <ToggleButton value="seeker" sx={{ textTransform: 'none', px: 2 }}>
              Job Seeker
            </ToggleButton>

            <ToggleButton value="employer" sx={{ textTransform: 'none', px: 2 }}>
              Employer
            </ToggleButton>

            <ToggleButton value="admin" sx={{ textTransform: 'none', px: 2 }}>
              Admin
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* EMAIL */}
        <Typography fontSize="14px" mb={0.5}>Email</Typography>
        <TextField
          fullWidth
          size="small"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        {/* PASSWORD */}
        <Typography fontSize="14px" mb={0.5}>Password</Typography>
        <TextField
          fullWidth
          size="small"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        {/* LOGIN BUTTON */}
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{ background: '#2563eb', textTransform: 'none', py: 1.2, mb: 2 }}
        >
          Login
        </Button>

        <Typography textAlign="center" fontSize="14px">
          No account?{' '}
          <Link to="/signup" style={{ color: '#2563eb', fontWeight: 'bold' }}>
            Register Now
          </Link>
        </Typography>

      </Paper>
    </Box>
  );
}

export default Login;