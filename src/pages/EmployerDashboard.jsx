import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box,Typography,AppBar,Toolbar,Button,Card,CardContent,Chip,Avatar} from '@mui/material';

const postedJobsData = [
  {
    title:'Frontend Developer',
    applicants:24,
    status:'Active'
  },
  {
    title:'UI/UX Designer',
    applicants:18,
    status:'Active'
  },
  {
    title:'React Developer',
    applicants:31,
    status:'Closed'
  },
];

const candidates = [
  {
    name:'Sree Renjini',
    job:'Frontend Developer',
    status:'Under Review',
    exp:'Fresher'
  },
  {
    name:'Priya Nair',
    job:'UI/UX Designer',
    status:'Interview',
    exp:'1 year'
  },
];

const statusColor = {
  'Under Review':'warning',
  'Interview':'info',
  'Shortlisted':'success',
  'Rejected':'error'
};

function EmployerDashboard() {

  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const [tab, setTab] = useState('jobs');

  const [jobs, setJobs] = useState(postedJobsData);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box sx={{ background:'#f5f5f5', minHeight:'100vh' }}>

      <AppBar position="static" sx={{ background:'#7c3aed' }}>
        <Toolbar sx={{ justifyContent:'space-between' }}>

          <Box>
            <Typography fontWeight="bold">
              Hello, {user?.name?.split(' ')[0]} 👔
            </Typography>

            <Typography fontSize="12px" color="#ddd8fe">
              Employer Dashboard
            </Typography>
          </Box>

          <Box sx={{ display:'flex', gap:1 }}>

            {['jobs','candidates'].map(t => (
              <Button
                key={t}
                color="inherit"
                onClick={() => setTab(t)}
                sx={{
                  textTransform:'none',
                  borderBottom:
                    tab===t ? '2px solid white' : 'none'
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}

            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ textTransform:'none' }}
            >
              Logout
            </Button>

          </Box>

        </Toolbar>
      </AppBar>

      <Box sx={{ p:3 }}>

        {tab === 'jobs' && (
          <>

            <Button
              variant="contained"
              sx={{
                mb:2,
                textTransform:'none',
                background:'#7c3aed'
              }}
              onClick={() =>
                setJobs([
                  ...jobs,
                  {
                    title:'New Developer',
                    applicants:0,
                    status:'Active'
                  }
                ])
              }
            >
              Post New Job
            </Button>

            <Card sx={{ borderRadius:3 }}>

              {jobs.map((job,i) => (
                <Box
                  key={i}
                  sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    alignItems:'center',
                    p:2,
                    borderBottom:
                      i < jobs.length-1
                        ? '1px solid #f0f0f0'
                        : 'none'
                  }}
                >

                  <Box>
                    <Typography fontWeight="bold">
                      {job.title}
                    </Typography>

                    <Typography
                      color="#6b7280"
                      fontSize="12px"
                    >
                      {job.applicants} applicants
                    </Typography>
                  </Box>

                  <Box sx={{ display:'flex', gap:1 }}>

                    <Chip
                      label={job.status}
                      size="small"
                      color={
                        job.status==='Active'
                          ? 'success'
                          : 'default'
                      }
                    />

                    <Button
                      color="error"
                      size="small"
                      onClick={() =>
                        setJobs(
                          jobs.filter((_, index) => index !== i)
                        )
                      }
                    >
                      Delete
                    </Button>

                  </Box>

                </Box>
              ))}

            </Card>
          </>
        )}

        {tab === 'candidates' && (
          <Card sx={{ borderRadius:3 }}>

            {candidates.map((c,i) => (
              <Box
                key={i}
                sx={{
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  p:2,
                  borderBottom:
                    i < candidates.length-1
                      ? '1px solid #f0f0f0'
                      : 'none'
                }}
              >

                <Box sx={{ display:'flex', gap:2 }}>

                  <Avatar sx={{ background:'#7c3aed' }}>
                    {c.name.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold">
                      {c.name}
                    </Typography>

                    <Typography
                      color="#6b7280"
                      fontSize="12px"
                    >
                      {c.job} • {c.exp}
                    </Typography>
                  </Box>

                </Box>

                <Chip
                  label={c.status}
                  size="small"
                  color={statusColor[c.status]}
                />

              </Box>
            ))}

          </Card>
        )}

      </Box>
    </Box>
  );
}

export default EmployerDashboard;