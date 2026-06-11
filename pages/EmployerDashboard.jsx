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
  TextField,
  MenuItem,
} from "@mui/material";

function EmployerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [tab, setTab] = useState("jobs");

  const [openJobForm, setOpenJobForm] = useState(false);

  // COMPANY FORM
  const [companyForm, setCompanyForm] = useState({
    companyName: "",
    location: "",
    website: "",
  });

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    salary: "",
    location: "",
    jobType: "Full-time",
    experience: "",
    companyId: "",
  });

 
  const fetchData = async () => {
    try {
      const [jobRes, companyRes] = await Promise.all([
        fetch("http://localhost:5000/api/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/company", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const jobsData = await jobRes.json();
      const companyData = await companyRes.json();

      if (!Array.isArray(jobsData)) setJobs([]);
      if (!Array.isArray(companyData)) setCompanies([]);

      setCompanies(companyData);

      const myCompany = companyData.find(
        (c) => Number(c.userId) === Number(user?.userId)
      );

      if (myCompany) {
        setJobForm((prev) => ({
          ...prev,
          companyId: myCompany.companyId,
        }));
      }

      const myCompanyIds = companyData
        .filter((c) => Number(c.userId) === Number(user?.userId))
        .map((c) => Number(c.companyId));

      const employerJobs = jobsData.filter((job) =>
        myCompanyIds.includes(Number(job.companyId))
      );

      setJobs(employerJobs);

      fetchApplications(employerJobs);
    } catch (err) {
      console.log(err);
      setJobs([]);
      setCompanies([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (user?.userId) fetchData();
  }, []);

  
  const createCompany = async () => {
    const res = await fetch("http://localhost:5000/api/company", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(companyForm),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Company creation failed");
      return;
    }

    alert("Company Created!");
    fetchData();
  };

  
  const handleCreateJob = async () => {
    const myCompany = companies.find(
      (c) => Number(c.userId) === Number(user?.userId)
    );

    if (!myCompany) {
      alert("Please create company first!");
      return;
    }

    const payload = {
      ...jobForm,
      companyId: myCompany.companyId,
      experience: Number(jobForm.experience),
    };

    const res = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Job creation failed");
      return;
    }

    alert("Job Posted Successfully!");
    setOpenJobForm(false);
    fetchData();
  };

  
  const fetchApplications = async (jobList = []) => {
    try {
      const res = await fetch("http://localhost:5000/api/application", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (!Array.isArray(data)) return setApplications([]);

      const jobIds = jobList.map((j) => j.jobId);

      setApplications(data.filter((app) => jobIds.includes(app.jobId)));
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const myCompany = companies.find(
    (c) => Number(c.userId) === Number(user?.userId)
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* HEADER */}
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography>Hello {user?.name?.split(" ")[0]} 👔</Typography>

          <Box>
            {["jobs", "candidates", "profile"].map((t) => (
              <Button key={t} onClick={() => setTab(t)} sx={{ color: "white" }}>
                {t}
              </Button>
            ))}

            <Button onClick={() => setOpenJobForm(true)} sx={{ color: "white" }}>
              + Post Job
            </Button>

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
              <Typography>No jobs found</Typography>
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

        
        {tab === "candidates" && (
          <Box>
            <Typography variant="h6">Candidates</Typography>

            {applications.length === 0 ? (
              <Typography>No applications yet</Typography>
            ) : (
              applications.map((app) => (
                <Card key={app.applicationId} sx={{ p: 2, mb: 2 }}>
                  <Typography>
                    Job: {app.job?.title}
                  </Typography>

                  <Typography>
                    Candidate: {app.jobSeeker?.user?.name || "N/A"}
                  </Typography>

                  <Typography>
                    Email: {app.jobSeeker?.user?.email || "N/A"}
                  </Typography>

                  <Typography>Status: {app.status}</Typography>
                </Card>
              ))
            )}
          </Box>
        )}

        
        {tab === "profile" && (
          <Box>
            <Typography variant="h6">Company Profile</Typography>

            {!myCompany ? (
              <Card sx={{ p: 2, mt: 2 }}>
                <Typography>Create Company First</Typography>

                <TextField
                  fullWidth
                  label="Company Name"
                  sx={{ mt: 2 }}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, companyName: e.target.value })
                  }
                />

                <TextField
                  fullWidth
                  label="Location"
                  sx={{ mt: 2 }}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, location: e.target.value })
                  }
                />

                <TextField
                  fullWidth
                  label="Website"
                  sx={{ mt: 2 }}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, website: e.target.value })
                  }
                />

                <Button sx={{ mt: 2 }} variant="contained" onClick={createCompany}>
                  Save Company
                </Button>
              </Card>
            ) : (
              <Card sx={{ p: 2, mt: 2 }}>
                <Typography>Company: {myCompany.companyName}</Typography>
                <Typography>Location: {myCompany.location}</Typography>
                <Typography>Website: {myCompany.website || "-"}</Typography>
              </Card>
            )}
          </Box>
        )}

        
        {openJobForm && (
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography fontWeight="bold">Post Job</Typography>

            <TextField fullWidth label="Title" sx={{ mt: 2 }}
              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
            />

            <TextField fullWidth label="Description" sx={{ mt: 2 }}
              onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
            />

            <TextField fullWidth label="Salary" sx={{ mt: 2 }}
              onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
            />

            <TextField fullWidth label="Location" sx={{ mt: 2 }}
              onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
            />

            <Button sx={{ mt: 2 }} variant="contained" onClick={handleCreateJob}>
              Submit Job
            </Button>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default EmployerDashboard;