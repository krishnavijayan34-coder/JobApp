import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Button, AppBar, Toolbar } from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';

function Home() {
  return (
    <Box>

      
      <AppBar position="static" sx={{ background: '#2563eb' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkIcon />
            <Typography fontWeight="bold" fontSize="20px">JobPortal</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/login"  color="inherit" sx={{ textTransform: 'none' }}>Login</Button>
            <Button component={Link} to="/signup" variant="outlined" color="inherit" sx={{ textTransform: 'none' }}>Register</Button>
          </Box>
        </Toolbar>
      </AppBar>

      
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#eff6ff', px: 10, py: 8, gap: 4 }}>

        
        <Box sx={{ maxWidth: '500px' }}>
          <Typography variant="h3" fontWeight="bold" color="#111827" lineHeight={1.3}>
            Find The Job<br />That Fits Your{' '}
            <span style={{ color: '#2563eb' }}>Future</span>
          </Typography>
          <Typography color="#6b7280" mt={2} mb={4} fontSize="16px">
            Explore thousands of job opportunities from top companies and build your dream career today.
          </Typography>
          <Box mb={2}>
            <Typography>✅ Thousands of Jobs matching your skills</Typography>
            <Typography mt={1}>🏢 Top Companies hiring freshers</Typography>
            <Typography mt={1}>📈 Career Growth opportunities</Typography>
          </Box>
          <Button component={Link} to="/login" variant="contained" size="large"
            sx={{ background: '#2563eb', textTransform: 'none', px: 5, mt: 2 }}>
            Get Started
          </Button>
        </Box>

        
        <Box component="img"
        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80"
          alt="Job Seeker"
          sx={{ width: '420px', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
        />
      </Box>

      
      <Box sx={{ display: 'flex', justifyContent: 'space-around', py: 4, background: '#f9fafb' }}>
        {[
          { n: '10,000+', l: 'Active Jobs' },
          { n: '5,000+',  l: 'Top Companies' },
          { n: '50,000+', l: 'Happy Candidates' },
          { n: '100%',    l: 'Trusted Platform' },
        ].map((s, i) => (
          <Box key={i} textAlign="center">
            <Typography fontWeight="bold" color="#2563eb" fontSize="22px">{s.n}</Typography>
            <Typography color="#6b7280" fontSize="14px">{s.l}</Typography>
          </Box>
        ))}
      </Box>

    </Box>
  );
}
export default Home;
