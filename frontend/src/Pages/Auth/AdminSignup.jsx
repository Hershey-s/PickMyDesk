import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { GoogleLogin } from "@react-oauth/google";

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5006";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${baseURL}/signup`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "admin", // Force admin role
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess("Admin account created successfully! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (error) {
      console.error("Admin signup error:", error);
      setError(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setLoading(true);
      const response = await axios.post(`${baseURL}/auth/google`, {
        token: credentialResponse.credential,
        expectedRole: "admin",
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess("Admin account created successfully! Redirecting...");
      setTimeout(() => navigate("/admin/dashboard"), 2000);
    } catch (error) {
      console.error("Google admin signup error:", error);
      setError(error.response?.data?.message || "Google signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 400, width: "100%" }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <AdminPanelSettingsIcon
              sx={{ fontSize: 40, color: "primary.main", mr: 1 }}
            />
            <Typography variant="h4" color="primary">
              Admin Signup
            </Typography>
          </Box>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Create account to manage workspaces
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Business Name / Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                fullWidth
                helperText="This will be displayed as your business name"
              />

              <TextField
                label="Business Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}
              {success && <Alert severity="success">{success}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                startIcon={<AdminPanelSettingsIcon />}
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up as Admin"}
              </Button>

              <Divider sx={{ my: 2 }}>OR</Divider>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google admin signup failed")}
                text="signup_with"
                shape="rectangular"
                size="large"
                width="100%"
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Already have an admin account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/admin/login")}
                    sx={{ textDecoration: "none" }}
                  >
                    Admin Login
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Looking to book workspaces?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/user/signup")}
                    sx={{ textDecoration: "none" }}
                  >
                    User Signup
                  </Link>
                </Typography>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminSignup;
