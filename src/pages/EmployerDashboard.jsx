import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Box,Typography,AppBar,Toolbar,Button,Card, Chip, Avatar,Dialog, DialogTitle,
  DialogContent,DialogActions,TextField,MenuItem
} from '@mui/material';

const postedJobsData = [
  {
    title: 'Frontend Developer',
    applicants: 24,
    status: 'Active',
    experience: 'Experienced'
  },
  {
    title: 'UI/UX Designer',
    applicants: 18,
    status: 'Active',
    experience: 'Fresher'
  },
  {
    title: 'React Developer',
    applicants: 31,
    status: 'Closed',
    experience: 'Experienced'
  },
];

const candidates = [
  {
    name: 'Sree Renjini',
    job: 'Frontend Developer',
    status: 'Under Review',
    exp: 'Fresher'
  },
  {
    name: 'Priya Nair',
    job: 'UI/UX Designer',
    status: 'Interview',
    exp: '1 year'
  },
];

const statusColor = {
  'Under Review': 'warning',
  'Interview': 'info',
  'Shortlisted': 'success',
  'Rejected': 'error'
};

function EmployerDashboard() {

  const user = JSON.parse(localStorage.getItem('user'));

  const navigate = useNavigate();

  const [tab, setTab] = useState('jobs');

  const [jobs, setJobs] = useState(postedJobsData);

  const [open, setOpen] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    applicants: 0,
    status: 'Active',
    experience: 'Fresher'
  });

  const [profile, setProfile] = useState({
    company: 'Mk Solutions',
    email: 'hr@mksolutions.com',
    location: 'Trivandrum'
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateJob = () => {

    setJobs([
      ...jobs,
      newJob
    ]);

    setNewJob({
      title: '',
      applicants: 0,
      status: 'Active',
      experience: 'Fresher'
    });

    setOpen(false);
  };

  return (
    <Box sx={{ background: '#f5f5f5', minHeight: '100vh' }}>

      <AppBar position="static" sx={{ background: '#7c3aed' }}>

        <Toolbar sx={{ justifyContent: 'space-between' }}>

          <Box>

            <Typography fontWeight="bold">
              Hello, {user?.name?.split(' ')[0]} 👔
            </Typography>

            <Typography fontSize="12px" color="#ddd8fe">
              Employer Dashboard
            </Typography>

          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>

            {['jobs', 'candidates', 'profile'].map(t => (
              <Button
                key={t}
                color="inherit"
                onClick={() => setTab(t)}
                sx={{
                  textTransform: 'none',
                  borderBottom:
                    tab === t ? '2px solid white' : 'none'
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}

            <Button
              color="inherit"
              onClick={handleLogout}
              sx={{ textTransform: 'none' }}
            >
              Logout
            </Button>

          </Box>

        </Toolbar>

      </AppBar>

      <Box sx={{ p: 3 }}>

        
        {tab === 'jobs' && (
          <>

            <Button
              variant="contained"
              sx={{
                mb: 2,
                textTransform: 'none',
                background: '#7c3aed'
              }}
              onClick={() => setOpen(true)}
            >
              Post New Job
            </Button>

            <Card sx={{ borderRadius: 3 }}>

              {jobs.map((job, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 2,
                    borderBottom:
                      i < jobs.length - 1
                        ? '1px solid #f0f0f0'
                        : 'none'
                  }}
                >

                  <Box>

                    <Typography fontWeight="bold">
                      {job.title}
                    </Typography>

                    <Typography
                      fontSize="12px"
                      color="#6b7280"
                    >
                      {job.experience} • {job.applicants} applicants
                    </Typography>

                  </Box>

                  <Box sx={{ display: 'flex', gap: 1 }}>

                    <Chip
                      label={job.status}
                      size="small"
                      color={
                        job.status === 'Active'
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

        {/* CANDIDATES */}
        {tab === 'candidates' && (
          <Card sx={{ borderRadius: 3 }}>

            {candidates.map((c, i) => (
              <Box
                key={i}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  borderBottom:
                    i < candidates.length - 1
                      ? '1px solid #f0f0f0'
                      : 'none'
                }}
              >

                <Box sx={{ display: 'flex', gap: 2 }}>

                  <Avatar sx={{ background: '#7c3aed' }}>
                    {c.name.charAt(0)}
                  </Avatar>

                  <Box>

                    <Typography fontWeight="bold">
                      {c.name}
                    </Typography>

                    <Typography
                      fontSize="12px"
                      color="#6b7280"
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

        
        {tab === 'profile' && (
          <Card sx={{ p: 3, borderRadius: 3 }}>

            <Typography
              fontWeight="bold"
              fontSize="18px"
              mb={1}
            >
              Company Profile
            </Typography>

            <Typography color="#6b7280">
              Company: {profile.company}
            </Typography>

            <Typography color="#6b7280">
              Email: {profile.email}
            </Typography>

            <Typography color="#6b7280">
              Location: {profile.location}
            </Typography>

          </Card>
        )}

      </Box>

      
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
      >

        <DialogTitle>
          Create New Job
        </DialogTitle>

        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            mt: 1
          }}
        >

          <TextField
            label="Job Title"
            value={newJob.title}
            onChange={(e) =>
              setNewJob({
                ...newJob,
                title: e.target.value
              })
            }
          />

          <TextField
            select
            label="Experience"
            value={newJob.experience}
            onChange={(e) =>
              setNewJob({
                ...newJob,
                experience: e.target.value
              })
            }
          >

            <MenuItem value="Fresher">
              Fresher
            </MenuItem>

            <MenuItem value="Experienced">
              Experienced
            </MenuItem>

          </TextField>

          <TextField
            type="number"
            label="Applicants"
            value={newJob.applicants}
            onChange={(e) =>
              setNewJob({
                ...newJob,
                applicants: e.target.value
              })
            }
          />

        </DialogContent>

        <DialogActions>

          <Button onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateJob}
            sx={{ background: '#7c3aed' }}
          >
            Create Job
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
}

export default EmployerDashboard;