import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper
} from '@mui/material';

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async () => {
     alert("Login button clicked");
    try {
      if (!formData.email || !formData.password) {
        alert('Fill all fields!');
        return;
      }

      const response = await fetch(
        'http://localhost:5000/api/auth/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        }
      );

      const data = await response.json();
      console.log("Status:", response.status);
      console.log("Data:", data);

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      if (data.user.role === 'EMPLOYER') {
        navigate('/employer');
      } else if (data.user.role === 'JOBSEEKER') {
        navigate('/seeker');
      } else {
        navigate('/');
      }

    } catch (error) {
      console.error(error);
      alert('Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#eff6ff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          width: 400
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          align="center"
          color="#2563eb"
        >
          💼 JobPortal
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          align="center"
        >
          Welcome Back!
        </Typography>

        <Typography
          align="center"
          color="#6b7280"
          fontSize="13px"
          mb={3}
        >
          Login to your account
        </Typography>

        <Typography fontSize="14px" mb={0.5}>
          Email
        </Typography>

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

        <Typography fontSize="14px" mb={0.5}>
          Password
        </Typography>

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
        <Button
          fullWidth
          variant="contained"
          onClick={handleLogin}
          sx={{
            background: '#2563eb',
            textTransform: 'none',
            py: 1.2,
            mb: 2
          }}
        >
          Login
        </Button>

        <Typography
          align="center"
          fontSize="14px"
        >
          No account?{' '}
          <Link
            to="/signup"
            style={{
              color: '#2563eb',
              fontWeight: 'bold'
            }}
          >
            Register Now
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;