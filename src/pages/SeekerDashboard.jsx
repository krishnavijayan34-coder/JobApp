import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, AppBar, Toolbar, Button, Card, CardContent,
         Chip, TextField, MenuItem, Avatar, Divider } from '@mui/material';
import JobCard from '../components/JobCard';
import { getAllJobs } from '../api/jobApi';
const allJobs = getAllJobs();

function SeekerDashboard() {

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [applied, setApplied] = useState([]);
  const [saved, setSaved] = useState([]);
  const [tab, setTab] = useState('jobs');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const filtered = allJobs.filter(j =>
    (filter === 'All' || j.type === filter) &&
    (
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
    )
  );

  const appliedJobs = allJobs.filter(j =>
    applied.includes(j.id)
  );

  return (
    <Box sx={{ background:'#f5f5f5', minHeight:'100vh' }}>

      <AppBar position="static" sx={{ background:'#2563eb' }}>
        <Toolbar sx={{ justifyContent:'space-between' }}>

          <Box>
            <Typography fontWeight="bold">
              Hello, {user?.name?.split(' ')[0]} 👋
            </Typography>

            <Typography fontSize="12px" color="#bfdbfe">
              Job Seeker Dashboard
            </Typography>
          </Box>

          <Box sx={{ display:'flex', gap:1 }}>

            {['jobs','saved','applications','profile'].map(t => (
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

        <Card sx={{ mb:3, borderRadius:3 }}>
          <CardContent>

            <Box
              sx={{
                display:'flex',
                justifyContent:'space-around',
                textAlign:'center'
              }}
            >

              {[
                {
                  icon:'📄',
                  n:appliedJobs.length,
                  l:'Applications'
                },
                {
                  icon:'📞',
                  n:0,
                  l:'Interviews'
                },
                {
                  icon:'🎁',
                  n:0,
                  l:'Offers'
                },
                {
                  icon:'🔖',
                  n:saved.length,
                  l:'Saved Jobs'
                },
              ].map((s,i) => (
                <Box key={i}>
                  <Typography fontSize="24px">
                    {s.icon}
                  </Typography>

                  <Typography
                    fontWeight="bold"
                    fontSize="20px"
                  >
                    {s.n}
                  </Typography>

                  <Typography
                    color="#6b7280"
                    fontSize="12px"
                  >
                    {s.l}
                  </Typography>
                </Box>
              ))}

            </Box>
          </CardContent>
        </Card>

        {tab === 'jobs' && (
          <>

            <Box sx={{ display:'flex', gap:2, mb:3 }}>

              <TextField
                fullWidth
                size="small"
                placeholder="Search job or company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <TextField
                select
                size="small"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                sx={{ minWidth:140 }}
              >

                {['All','Full-time','Remote','Hybrid'].map(t => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}

              </TextField>
            </Box>

            <Typography fontWeight="bold" mb={1.5}>
              Available Jobs
            </Typography>

            <Box
              sx={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',
                gap:2
              }}
            >

              {filtered.map(job => (
                <JobCard
                  key={job.id}
                  {...job}
                  applied={applied.includes(job.id)}
                  onApply={() => setApplied(p => [...p, job.id])}
                  onSave={() => setSaved(p => [...p, job.id])}
                />
              ))}

            </Box>
          </>
        )}

        {tab === 'saved' && (
          <>
            <Typography fontWeight="bold" mb={1.5}>
              Saved Jobs
            </Typography>

            {saved.length === 0 ? (
              <Typography color="#6b7280">
                No saved jobs yet.
              </Typography>
            ) : (
              <Box
                sx={{
                  display:'grid',
                  gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',
                  gap:2
                }}
              >
                {allJobs
                  .filter(job => saved.includes(job.id))
                  .map(job => (
                    <JobCard
                      key={job.id}
                      {...job}
                      applied={applied.includes(job.id)}
                      onApply={() => setApplied(p => [...p, job.id])}
                    />
                ))}
              </Box>
            )}
          </>
        )}

        {tab === 'applications' && (
          <>
            <Typography fontWeight="bold" mb={1.5}>
              My Applications
            </Typography>

            {appliedJobs.length === 0
              ? (
                <Typography color="#6b7280">
                  You haven't applied to any jobs yet.
                </Typography>
              )
              : (
                <Card sx={{ borderRadius:3 }}>

                  {appliedJobs.map((app, i) => (
                    <Box
                      key={i}
                      sx={{
                        display:'flex',
                        justifyContent:'space-between',
                        alignItems:'center',
                        p:2,
                        borderBottom:
                          i < appliedJobs.length-1
                            ? '1px solid #f0f0f0'
                            : 'none'
                      }}
                    >

                      <Box>
                        <Typography
                          fontWeight="bold"
                          fontSize="14px"
                        >
                          {app.title}
                        </Typography>

                        <Typography
                          color="#6b7280"
                          fontSize="12px"
                        >
                          {app.company} • {app.location}
                        </Typography>

                        <Typography
                          color="#9ca3af"
                          fontSize="11px"
                        >
                          Applied recently
                        </Typography>
                      </Box>

                      <Chip
                        label="Under Review"
                        color="warning"
                        size="small"
                      />

                    </Box>
                  ))}
                </Card>
              )
            }
          </>
        )}

        {tab === 'profile' && (
          <Card sx={{ borderRadius:3, p:3 }}>

            <Box
              sx={{
                display:'flex',
                alignItems:'center',
                gap:2,
                mb:2
              }}
            >

              <Avatar
                sx={{
                  width:64,
                  height:64,
                  background:'#2563eb',
                  fontSize:'24px'
                }}
              >
                {user?.name?.charAt(0)}
              </Avatar>

              <Box>
                <Typography
                  fontWeight="bold"
                  fontSize="18px"
                >
                  {user?.name}
                </Typography>

                <Typography
                  color="#6b7280"
                  fontSize="14px"
                >
                  {user?.email}
                </Typography>

                <Chip
                  label="Job Seeker"
                  size="small"
                  sx={{
                    background:'#eff6ff',
                    color:'#2563eb',
                    mt:0.5
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ mb:2 }} />

            <Typography fontSize="14px" color="#6b7280">
              📞 Phone: {user?.phone || 'Not provided'}
            </Typography>

            <Typography fontSize="14px" color="#6b7280" mt={1}>
              📄 Resume: Not uploaded
            </Typography>

            <Typography fontSize="14px" color="#6b7280" mt={1}>
              🎓 Experience: Fresher
            </Typography>

            <Button
              component="label"
              variant="contained"
              sx={{
                mt:2,
                textTransform:'none',
                background:'#2563eb'
              }}
            >
              Upload Resume
              <input hidden type="file" />
            </Button>

            <Button
              variant="outlined"
              sx={{
                mt:2,
                ml:2,
                textTransform:'none',
                borderColor:'#2563eb',
                color:'#2563eb'
              }}
            >
              Edit Profile
            </Button>

          </Card>
        )}

      </Box>
    </Box>
  );
}

export default SeekerDashboard;