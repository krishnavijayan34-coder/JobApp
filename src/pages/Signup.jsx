import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Paper,
         ToggleButton, ToggleButtonGroup } from '@mui/material';

function Signup() {
  const [role,     setRole]     = useState('seeker');
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [phone,    setPhone]    = useState('');
  const navigate = useNavigate();
  const handleSignup = () => {
    if (!name || !email || !password || !confirm || !phone) { alert('Fill all fields!'); return; }
    if (password !== confirm) { alert('Passwords do not match!'); return; }
    localStorage.setItem('user', JSON.stringify({ name, email, role, phone }));
    alert('Account Created! Please Login.');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight:'100vh', background:'#eff6ff',
      display:'flex', justifyContent:'center', alignItems:'center', py:4 }}>
      <Paper elevation={4} sx={{ p:4, borderRadius:3, width:400 }}>

        <Typography variant="h6" fontWeight="bold" textAlign="center" color="#2563eb" mb={0.5}>
          💼 JobPortal
        </Typography>
        <Typography variant="h6" fontWeight="bold" textAlign="center" mb={0.5}>
          Create Your Account
        </Typography>
        <Typography textAlign="center" color="#6b7280" fontSize="13px" mb={2}>
          Join thousands of job seekers today
        </Typography>

        <Box sx={{ display:'flex', justifyContent:'center', mb:2 }}>
          <ToggleButtonGroup value={role} exclusive size="small"
            onChange={(e, val) => val && setRole(val)}>
            <ToggleButton value="seeker"   sx={{ textTransform:'none', px:3 }}>Job Seeker</ToggleButton>
            <ToggleButton value="employer" sx={{ textTransform:'none', px:3 }}>Employer</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField fullWidth size="small" placeholder="Full Name"
          value={name}     onChange={e => setName(e.target.value)}     sx={{ mb:2 }} />
        <TextField fullWidth size="small" placeholder="Email Address" type="email"
          value={email}    onChange={e => setEmail(e.target.value)}    sx={{ mb:2 }} />
        <TextField fullWidth size="small" placeholder="Phone Number"
          value={phone}    onChange={e => setPhone(e.target.value)}    sx={{ mb:2 }} />
        <TextField fullWidth size="small" placeholder="Password" type="password"
          value={password} onChange={e => setPassword(e.target.value)} sx={{ mb:2 }} />
        <TextField fullWidth size="small" placeholder="Confirm Password" type="password"
          value={confirm}  onChange={e => setConfirm(e.target.value)}  sx={{ mb:3 }} />

        <Button fullWidth variant="contained" onClick={handleSignup}
          sx={{ background:'#2563eb', textTransform:'none', mb:2 }}>
          Sign Up
        </Button>
        <Typography textAlign="center" fontSize="14px">
          Already have account?{' '}
          <Link to="/login" style={{ color:'#2563eb', fontWeight:'bold' }}>Log in</Link>
        </Typography>

      </Paper>
    </Box>
  );
}
export default Signup;