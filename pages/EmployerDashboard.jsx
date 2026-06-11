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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, companyRes] = await Promise.all([
          fetch("http://localhost:5000/api/jobs"),
          fetch("http://localhost:5000/api/company"),
        ]);

        const jobsData = await jobRes.json();
        const companyData = await companyRes.json();

        console.log("USER:", user);
        console.log("COMPANIES:", companyData);
        console.log("JOBS:", jobsData);

        setCompanies(companyData);

        const myCompanyIds = companyData
          .filter((c) => Number(c.userId) === Number(user?.userId || user?.id))
          .map((c) => Number(c.companyId));

        console.log("My company IDs:", myCompanyIds);

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

    if (user) fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography>Hello {user?.name?.split(" ")[0]} 👔</Typography>

          <Box>
            {["jobs", "candidates", "profile"].map((t) => (
              <Button key={t} onClick={() => setTab(t)} sx={{ color: "white" }}>
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
            <Typography variant="h5">Posted Jobs</Typography>

            {loadingJobs ? (
              <CircularProgress />
            ) : jobs.length === 0 ? (
              <Typography>No jobs found (CHECK COMPANY LINKING)</Typography>
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
      </Box>
    </Box>
  );
}


export default EmployerDashboard;