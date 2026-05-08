import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper,
         ToggleButton, ToggleButtonGroup } from '@mui/material';

const users = [
  { name:'Krishna Vijayan', email:'krishnavijayan34@gmail.com', password:'1234', role:'seeker'   },
  { name:'Rahul Employer',  email:'rahul@company.com',          password:'1234', role:'employer' },
  { name:'Admin',           email:'admin@jobportal.com',        password:'admin123', role:'admin'},
];

function Login() {
  const [role,     setRole]     = useState('seeker');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) { alert('Fill all fields!'); return; }
    const found = users.find(u => u.email===email && u.password===password && u.role===role);
    if (!found) { alert('Invalid credentials!'); return; }
    localStorage.setItem('user', JSON.stringify(found));
    navigate(role === 'seeker' ? '/seeker' : role === 'employer' ? '/employer' : '/admin');
  };

  return (
    <Box sx={{ minHeight:'100vh', background:'#eff6ff',
      display:'flex', justifyContent:'center', alignItems:'center' }}>
      <Paper elevation={4} sx={{ p:4, borderRadius:3, width:400 }}>

        <Typography variant="h5" fontWeight="bold" textAlign="center" color="#2563eb" mb={1}>
          💼 JobPortal
        </Typography>
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={1}>Welcome Back!</Typography>
        <Typography textAlign="center" color="#6b7280" fontSize="13px" mb={3}>
          Select your role and login
        </Typography>

        {/* Role Toggle — 3 options */}
        <Box sx={{ display:'flex', justifyContent:'center', mb:3 }}>
          <ToggleButtonGroup value={role} exclusive size="small"
            onChange={(e, val) => val && setRole(val)}>
            <ToggleButton value="seeker"   sx={{ textTransform:'none', px:2 }}>Job Seeker</ToggleButton>
            <ToggleButton value="employer" sx={{ textTransform:'none', px:2 }}>Employer</ToggleButton>
            <ToggleButton value="admin"    sx={{ textTransform:'none', px:2 }}>Admin</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography fontSize="14px" mb={0.5}>Email</Typography>
        <TextField fullWidth size="small" type="email" placeholder="Enter your email"
          value={email} onChange={e => setEmail(e.target.value)} sx={{ mb:2 }} />

        <Typography fontSize="14px" mb={0.5}>Password</Typography>
        <TextField fullWidth size="small" type="password" placeholder="Enter your password"
          value={password} onChange={e => setPassword(e.target.value)} sx={{ mb:3 }} />

        <Button fullWidth variant="contained" onClick={handleLogin}
          sx={{ background:'#2563eb', textTransform:'none', py:1.2, mb:2 }}>
          Login
        </Button>
        <Typography textAlign="center" fontSize="14px">
          No account?{' '}
          <Link to="/signup" style={{ color:'#2563eb', fontWeight:'bold' }}>Register Now</Link>
        </Typography>

      </Paper>
    </Box>
  );
}
export default Login;