import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

import JobCard from "../components/JobCard";
import { getSavedJobs, saveJob } from "../api/savedJobApi";

function SeekerDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [applied, setApplied] = useState([]);
  const [saved, setSaved] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState("jobs");
  const [editMode, setEditMode] = useState(false);

  const [profileForm, setProfileForm] = useState({
    contactNumber: "",
    qualification: "",
    experience: "",
  });


  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/jobs", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Jobs loaded:", data);

        if (Array.isArray(data)) {
          setJobs(data);
        } else {
          setJobs([]);
        }
      })
      .catch((err) => {
        console.log(err);
        setJobs([]);
      });
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

 
  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/application/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

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

  useEffect(() => {
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

        setProfileForm({
          contactNumber: data?.contactNumber || "",
          qualification: data?.qualification || "",
          experience: data?.experience || "",
        });
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

      if (res.ok) fetchApplications();
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

  
  const handleProfileSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/jobseeker/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileForm),
        }
      );

      const data = await res.json();

      setProfile({
        ...profile,
        ...profileForm,
      });

      setEditMode(false);
      alert("Profile updated successfully");
    } catch (err) {
      console.log(err);
    }
  };

  
  const filtered = (jobs || []).filter(
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
            Hello {user?.name?.split(" ")[0] || "User"} 👋
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
            <Typography fontWeight="bold" mb={2}>
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
                    applied={applied.includes(Number(job.jobId))}
                    onApply={() => handleApply(job.jobId)}
                    onSave={() => handleSave(job.jobId)}
                  />
                ))}
            </Box>
          </Box>
        )}

        
        {tab === "applications" && (
          <Box>
            <Typography fontWeight="bold" mb={2}>
              My Applications
            </Typography>

            {applications.length === 0 ? (
              <Typography>No applications yet</Typography>
            ) : (
              applications.map((app) => (
                <Box
                  key={app.applicationId}
                  sx={{ p: 2, mb: 1, background: "white", borderRadius: 2 }}
                >
                  <Typography fontWeight="bold">
                    {app.job?.title}
                  </Typography>

                  <Typography>
                    📍 {app.job?.location} | {app.job?.jobType}
                  </Typography>

                  <Typography>💰 ₹{app.job?.salary}</Typography>

                  <Typography>Status: {app.status}</Typography>
                </Box>
              ))
            )}
          </Box>
        )}

        
        {tab === "profile" && (
          <Box sx={{ background: "white", p: 3, borderRadius: 2 }}>
            <Typography fontWeight="bold" mb={2}>
              Profile
            </Typography>

            {!editMode ? (
              <>
                <Typography>Name: {profile?.user?.name}</Typography>
                <Typography>Email: {profile?.user?.email}</Typography>
                <Typography>
                  Phone: {profile?.contactNumber || "Not added"}
                </Typography>
                <Typography>
                  Qualification: {profile?.qualification || "Not added"}
                </Typography>
                <Typography>
                  Experience: {profile?.experience || 0} years
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </Button>
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  label="Phone"
                  sx={{ mb: 2 }}
                  value={profileForm.contactNumber}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      contactNumber: e.target.value,
                    })
                  }
                />

                <TextField
                  fullWidth
                  label="Qualification"
                  sx={{ mb: 2 }}
                  value={profileForm.qualification}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      qualification: e.target.value,
                    })
                  }
                />

                <TextField
                  fullWidth
                  label="Experience"
                  sx={{ mb: 2 }}
                  value={profileForm.experience}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      experience: e.target.value,
                    })
                  }
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button variant="contained" onClick={handleProfileSave}>
                    Save
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default SeekerDashboard;
