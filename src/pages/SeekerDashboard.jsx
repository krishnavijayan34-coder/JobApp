import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
} from "@mui/material";

import JobCard from "../components/JobCard";
import { getSavedJobs, saveJob } from "../api/savedJobApi";

function SeekerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [applied, setApplied] = useState([]);
  const [saved, setSaved] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("jobs");

  
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(console.log);
  }, []);

  
  const fetchSavedJobs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await getSavedJobs(token);

      const data = res?.data || res || [];

      const ids = Array.isArray(data)
        ? data
            .map((x) => {
              if (typeof x === "number") return x;
              if (x?.jobId) return Number(x.jobId);
              if (x?.job?.jobId) return Number(x.job.jobId);
              return null;
            })
            .filter(Boolean)
        : [];

      setSaved([...new Set(ids)]); 
    } catch (err) {
      console.log(err);
      setSaved([]);
    }
  };

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/application/my",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (Array.isArray(data)) {
          setApplications(data);
          setApplied([...new Set(data.map((a) => Number(a.jobId)))]);
        } else {
          setApplications([]);
          setApplied([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchApplications();
  }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "http://localhost:5000/api/jobseeker/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProfile();
  }, []);

 
  const handleApply = async (jobId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/application/apply",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ jobId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setApplied((prev) => [...new Set([...prev, Number(jobId)])]);
        setApplications((prev) => [...prev, data]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  
  const handleSave = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      await saveJob(jobId, token);

     
      fetchSavedJobs();
    } catch (err) {
      console.log(err);
    }
  };

  
  const filtered = jobs.filter(
    (j) =>
      (filter === "All" || j.jobType === filter) &&
      (j.title?.toLowerCase().includes(search.toLowerCase()) ||
        j.company?.companyName?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* HEADER */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography>
            Hello {user?.name?.split(" ")[0]} 👋
          </Typography>

          <Box>
            {["jobs", "saved", "applications", "profile"].map((t) => (
              <Button
                key={t}
                onClick={() => setTab(t)}
                sx={{ color: "white" }}
              >
                {t}
              </Button>
            ))}
            <Button onClick={handleLogout} sx={{ color: "white" }}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box p={3}>
        {/* STATS */}
        <Card sx={{ mb: 2 }}>
          <CardContent sx={{ display: "flex", justifyContent: "space-around" }}>
            <Box sx={{ textAlign: "center" }}>
              <Typography fontSize={20}>{applied.length}</Typography>
              <Typography>Applications</Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <Typography fontSize={20}>{saved.length}</Typography>
              <Typography>Saved</Typography>
            </Box>
          </CardContent>
        </Card>

      
        {tab === "jobs" && (
          <>
            <Box display="flex" gap={2} mb={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search jobs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <TextField
                select
                size="small"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ width: 150 }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Full-time">Full-time</MenuItem>
                <MenuItem value="Remote">Remote</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(250px,1fr))",
                gap: 2,
              }}
            >
              {filtered.map((job) => (
                <JobCard
                  key={job.jobId}
                  title={job.title}
                  company={job.company?.companyName}
                  location={job.location}
                  salary={job.salary}
                  type={job.jobType}
                  applied={applied.includes(Number(job.jobId))}
                  onApply={() => handleApply(job.jobId)}
                  onSave={() => handleSave(job.jobId)}
                />
              ))}
            </Box>
          </>
        )}

        
        {tab === "saved" && (
          <Box>
            <Typography mb={2} fontWeight="bold">
              Saved Jobs
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(250px,1fr))",
                gap: 2,
              }}
            >
              {jobs
                .filter((j) => saved.includes(Number(j.jobId)))
                .map((job) => (
                  <JobCard
                    key={job.jobId}
                    title={job.title}
                    company={job.company?.companyName}
                    location={job.location}
                    salary={job.salary}
                    type={job.jobType}
                  />
                ))}
            </Box>
          </Box>
        )}

        
        {tab === "applications" && (
          <Box>
            <Typography mb={2} fontWeight="bold">
              My Applications
            </Typography>

            {applications.length === 0 ? (
              <Typography>No applications yet</Typography>
            ) : (
              applications.map((app) => (
                <Card key={app.applicationId} sx={{ p: 2, mb: 1 }}>
                  <Typography fontWeight="bold">
                    {app.job?.title}
                  </Typography>

                  <Typography>
                    📍 {app.job?.location} | {app.job?.jobType}
                  </Typography>

                  <Typography>
                    💰 ₹{app.job?.salary} | 🎯 {app.job?.experience} yrs
                  </Typography>

                  <Typography>Status: {app.status}</Typography>

                  <Typography fontSize={12} color="gray">
                    Applied:{" "}
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </Typography>
                </Card>
              ))
            )}
          </Box>
        )}

        
        {tab === "profile" && (
          <Card sx={{ p: 3 }}>
            <Typography fontWeight="bold">
              {profile?.user?.name || user?.name}
            </Typography>
            <Typography>
              {profile?.user?.email || user?.email}
            </Typography>
            <Typography>📞 {profile?.contactNumber}</Typography>
            <Typography>🎓 {profile?.qualification}</Typography>
            <Typography>💼 {profile?.experience}</Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default SeekerDashboard;