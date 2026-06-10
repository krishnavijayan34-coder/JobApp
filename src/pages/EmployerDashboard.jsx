import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CircularProgress,
} from "@mui/material";

function EmployerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [tab, setTab] = useState("jobs");

  // ========================
  // FETCH JOBS + COMPANIES
  // ========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, companyRes] = await Promise.all([
          fetch("http://localhost:5000/api/jobs"),
          fetch("http://localhost:5000/api/company"),
        ]);

        const jobsData = await jobRes.json();
        const companyData = await companyRes.json();

        setCompanies(companyData);

        const myCompanyIds = companyData
          .filter((c) => Number(c.userId) === Number(user?.userId))
          .map((c) => Number(c.companyId));

        const employerJobs = jobsData.filter((job) =>
          myCompanyIds.includes(Number(job.companyId))
        );

        setJobs(employerJobs);
      } catch (err) {
        console.log("Job fetch error:", err);
      } finally {
        setLoadingJobs(false);
      }
    };

    if (user?.userId) fetchData();
  }, [user?.userId]);

  // ========================
  // FETCH APPLICATIONS
  // ========================
  const fetchApplications = async () => {
    try {
      setLoadingApps(true);

      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/application", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok || !Array.isArray(data)) {
        console.log("Application API error:", data);
        setApplications([]);
        return;
      }

      const jobIds = jobs.map((j) => String(j.jobId));

      const filtered = data.filter((app) =>
        jobIds.includes(String(app.jobId || app.job?.jobId))
      );

      setApplications(filtered);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    if (tab === "candidates" && jobs.length > 0) {
      fetchApplications();
    }
  }, [tab, jobs]);

  // ========================
  // LOGOUT
  // ========================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <Box sx={{ background: "#f5f5f5", minHeight: "100vh" }}>
      <AppBar position="static" sx={{ background: "#7c3aed" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography fontWeight="bold">
            Hello, {user?.name?.split(" ")[0]} 👔
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {["jobs", "candidates", "profile"].map((t) => (
              <Button key={t} color="inherit" onClick={() => setTab(t)}>
                {t}
              </Button>
            ))}

            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        {/* JOBS */}
        {tab === "jobs" && (
          <>
            <Typography variant="h5">Posted Jobs</Typography>

            {loadingJobs ? (
              <CircularProgress />
            ) : jobs.length === 0 ? (
              <Typography>No jobs found for your company</Typography>
            ) : (
              jobs.map((job) => (
                <Card key={job.jobId} sx={{ p: 2, my: 1 }}>
                  <Typography fontWeight="bold">{job.title}</Typography>
                  <Typography>{job.location}</Typography>
                  <Typography>₹ {job.salary}</Typography>
                </Card>
              ))
            )}
          </>
        )}

        {/* CANDIDATES */}
        {tab === "candidates" && (
          <Card sx={{ p: 3 }}>
            <Typography fontWeight="bold">
              Applications for Your Jobs
            </Typography>

            {loadingApps ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : applications.length === 0 ? (
              <Typography sx={{ mt: 2 }}>No applications yet</Typography>
            ) : (
              applications.map((app) => {
                const job = jobs.find(
                  (j) => Number(j.jobId) === Number(app.jobId)
                );

                return (
                  <Box
                    key={app.applicationId}
                    sx={{ p: 2, mt: 2, border: "1px solid #ddd" }}
                  >
                    <Typography>
                      Job: {job?.title || "Unknown Job"}
                    </Typography>

                    <Typography>
                      Candidate: {app.jobSeeker?.user?.name}
                    </Typography>

                    <Typography>
                      Email: {app.jobSeeker?.user?.email}
                    </Typography>

                    <Typography>
                      Status: {app.status}
                    </Typography>
                  </Box>
                );
              })
            )}
          </Card>
        )}

        {/* PROFILE */}
        {tab === "profile" && (
          <Card sx={{ p: 3 }}>
            <Typography>Company Profile</Typography>

            {companies
              .filter((c) => Number(c.userId) === Number(user?.userId))
              .map((c) => (
                <Box key={c.companyId}>
                  <Typography>Name: {c.companyName}</Typography>
                  <Typography>Location: {c.location}</Typography>
                </Box>
              ))}
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default EmployerDashboard;