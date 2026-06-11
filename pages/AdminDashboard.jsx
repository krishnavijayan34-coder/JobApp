import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Box,Typography,AppBar,Toolbar,Button,Card,Chip,Avatar} from '@mui/material';

const allUsersData = [
  {
    name:'Krishna Vijayan',
    email:'krishna@gmail.com',
    role:'seeker',
    status:'Active'
  },
  {
    name:'Rahul Employer',
    email:'rahul@company.com',
    role:'employer',
    status:'Active'
  },
];


const allJobsData = [
  {
    title:'Frontend Developer',
    company:'Google',
    applicants:24,
    status:'Active'
  },
  {
    title:'React Developer',
    company:'Infosys',
    applicants:18,
    status:'Closed'
  },
];

const reports = [
  {
    label:'Total Users',
    value:2,
    icon:'👥'
  },
  {
    label:'Total Jobs',
    value:2,
    icon:'💼'
  },
  {
    label:'Applications',
    value:5,
    icon:'📄'
  },
];

const roleColor = {
  seeker:'error',
  employer:'secondary'
};

const statusColor = {
  Active:'success',
  Closed:'default'
};

function AdminDashboard() {

  const navigate = useNavigate();

  const [tab, setTab] = useState('reports');

  const [users, setUsers] = useState(allUsersData);

  const [jobs, setJobs] = useState(allJobsData);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Box sx={{ background:'#f5f5f5', minHeight:'100vh' }}>

      <AppBar position="static" sx={{ background:'#111827' }}>
        <Toolbar sx={{ justifyContent:'space-between' }}>

          <Typography fontWeight="bold">
            👑 Admin Dashboard
          </Typography>

          <Box sx={{ display:'flex', gap:1 }}>

            {['reports','users','jobs'].map(t => (
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
            >
              Logout
            </Button>

          </Box>

        </Toolbar>
      </AppBar>

      <Box sx={{ p:3 }}>

        {tab === 'reports' && (
          <Box
            sx={{
              display:'grid',
              gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',
              gap:2
            }}
          >

            {reports.map((r,i) => (
              <Card
                key={i}
                sx={{
                  p:3,
                  textAlign:'center',
                  borderRadius:3
                }}
              >

                <Typography fontSize="30px">
                  {r.icon}
                </Typography>

                <Typography
                  fontWeight="bold"
                  fontSize="24px"
                >
                  {r.value}
                </Typography>

                <Typography color="#6b7280">
                  {r.label}
                </Typography>

              </Card>
            ))}

          </Box>
        )}

        {tab === 'users' && (
          <Card sx={{ borderRadius:3 }}>

            {users.map((u,i) => (
              <Box
                key={i}
                sx={{
                  display:'flex',
                  justifyContent:'space-between',
                  alignItems:'center',
                  p:2,
                  borderBottom:
                    i < users.length-1
                      ? '1px solid #f0f0f0'
                      : 'none'
                }}
              >

                <Box sx={{ display:'flex', gap:2 }}>

                  <Avatar sx={{ background:'#111827' }}>
                    {u.name.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography fontWeight="bold">
                      {u.name}
                    </Typography>

                    <Typography
                      color="#6b7280"
                      fontSize="12px"
                    >
                      {u.email}
                    </Typography>
                  </Box>

                </Box>

                <Box sx={{ display:'flex', gap:1 }}>

                  <Chip
                    label={u.role}
                    size="small"
                    color={roleColor[u.role]}
                  />

                  <Chip
                    label={u.status}
                    size="small"
                    color="success"
                  />

                  <Button
                    color="error"
                    size="small"
                    onClick={() =>
                      setUsers(
                        users.filter((_, index) => index !== i)
                      )
                    }
                  >
                    Remove
                  </Button>

                </Box>

              </Box>
            ))}

          </Card>
        )}

        {tab === 'jobs' && (
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
                    {job.company} • {job.applicants} applicants
                  </Typography>
                </Box>

                <Box sx={{ display:'flex', gap:1 }}>

                  <Chip
                    label={job.status}
                    size="small"
                    color={statusColor[job.status]}
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
        )}

      </Box>
    </Box>
  );
}

export default AdminDashboard;