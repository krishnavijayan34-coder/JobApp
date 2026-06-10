import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Chip,
  TextField,
  MenuItem,
  Avatar,
  Divider,
} from "@mui/material";

import JobCard from "../components/JobCard";

function SeekerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [applied, setApplied] = useState([]);
  const [saved, setSaved] = useState([]);
  const [tab, setTab] = useState("jobs");

  // ✅ FETCH JOBS FROM BACKEND
  useEffect(() => {
    fetch("http://localhost:5000/api/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // ✅ FILTER JOBS (backend format)
  const filtered = jobs.filter((job) => {
    const matchesFilter =
      filter === "All" || job.jobType === filter;

    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.companyName
        ?.toLowerCase()
        .includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const appliedJobs = jobs.filter((job) =>
    applied.includes(job.jobId)
  );

  return (
    <Box sx={{ background: "#f5f5f5", minHeight: "100vh" }}>
      {/* HEADER */}
      <AppBar position="static" sx={{ background: "#2563eb" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography fontWeight="bold">
              Hello, {user?.name?.split(" ")[0]} 👋
            </Typography>
            <Typography fontSize="12px" color="#bfdbfe">
              Job Seeker Dashboard
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {["jobs", "saved", "applications", "profile"].map((t) => (
              <Button
                key={t}
                color="inherit"
                onClick={() => setTab(t)}
                sx={{
                  textTransform: "none",
                  borderBottom:
                    tab === t ? "2px solid white" : "none",
                }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Button>
            ))}

            <Button onClick={handleLogout} color="inherit">
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* STATS */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-around" }}>
              <Box textAlign="center">
                <Typography fontSize="22px">📄</Typography>
                <Typography fontWeight="bold">
                  {applied.length}
                </Typography>
                <Typography fontSize="12px">
                  Applications
                </Typography>
              </Box>

              <Box textAlign="center">
                <Typography fontSize="22px">🔖</Typography>
                <Typography fontWeight="bold">
                  {saved.length}
                </Typography>
                <Typography fontSize="12px">Saved</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* JOBS TAB */}
        {tab === "jobs" && (
          <>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search jobs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <TextField
                select
                size="small"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ minWidth: 150 }}
              >
                {["All", "Full-time", "Remote", "Hybrid"].map(
                  (type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Box>

            <Typography fontWeight="bold" mb={2}>
              Available Jobs
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill, minmax(250px, 1fr))",
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
                  applied={applied.includes(job.jobId)}
                  onApply={() =>
                    setApplied((prev) => [
                      ...prev,
                      job.jobId,
                    ])
                  }
                  onSave={() =>
                    setSaved((prev) => [
                      ...prev,
                      job.jobId,
                    ])
                  }
                />
              ))}
            </Box>
          </>
        )}

        {/* SAVED */}
        {tab === "saved" && (
          <Typography>
            Saved Jobs: {saved.length}
          </Typography>
        )}

        {/* APPLICATIONS */}
        {tab === "applications" && (
          <Typography>
            Applied Jobs: {appliedJobs.length}
          </Typography>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <Card sx={{ p: 3 }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Avatar sx={{ width: 60, height: 60 }}>
                {user?.name?.charAt(0)}
              </Avatar>

              <Box>
                <Typography fontWeight="bold">
                  {user?.name}
                </Typography>
                <Typography color="gray">
                  {user?.email}
                </Typography>

                <Chip
                  label="Job Seeker"
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography>
              Experience: Fresher
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default SeekerDashboard;