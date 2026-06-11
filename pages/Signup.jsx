import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    role: "seeker",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (event, value) => {
    if (value) {
      setFormData({
        ...formData,
        role: value,
      });
    }
  };

  const handleSignup = async () => {
    const {
      name,
      email,
      phone,
      password,
      confirm,
      role,
    } = formData;

    if (!name || !email || !phone || !password || !confirm) {
      alert("Fill all fields!");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          role:
            role === "seeker"
              ? "JOBSEEKER"
              : "EMPLOYER",
        }
      );

      console.log("REGISTER RESPONSE:", response.data);

      alert("Account Created Successfully!");

      navigate("/login");
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Registration Failed"
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#eff6ff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          width: 400,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
          color="#2563eb"
        >
          💼 JobPortal
        </Typography>

        <Typography
          variant="h6"
          fontWeight="bold"
          textAlign="center"
        >
          Create Your Account
        </Typography>

        <Typography
          textAlign="center"
          color="#6b7280"
          fontSize="13px"
          mb={2}
        >
          Join thousands of job seekers today
        </Typography>

        {/* Role Selection */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <ToggleButtonGroup
            value={formData.role}
            exclusive
            size="small"
            onChange={handleRoleChange}
          >
            <ToggleButton
              value="seeker"
              sx={{ textTransform: "none" }}
            >
              Job Seeker
            </ToggleButton>

            <ToggleButton
              value="employer"
              sx={{ textTransform: "none" }}
            >
              Employer
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <TextField
          fullWidth
          size="small"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          size="small"
          name="confirm"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirm}
          onChange={handleChange}
          sx={{ mb: 3 }}
        />

        <Button
          fullWidth
          variant="contained"
          onClick={handleSignup}
          sx={{
            background: "#2563eb",
            textTransform: "none",
          }}
        >
          Sign Up
        </Button>

        <Typography
          textAlign="center"
          fontSize="14px"
          mt={2}
        >
          Already have account?{" "}
          <Link
            to="/login"
            style={{
              color: "#2563eb",
              fontWeight: "bold",
            }}
          >
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Signup;