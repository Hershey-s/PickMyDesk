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
import { GoogleLogin } from "@react-oauth/google";

const UserSignup = () => {
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

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5004";

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
        role: "user", // Force user role
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Signup error:", error);
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
        expectedRole: "user",
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (error) {
      console.error("Google signup error:", error);
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
          <Typography variant="h4" align="center" gutterBottom color="primary">
            User Signup
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Create account to book workspaces
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                label="Email"
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
              >
                {loading ? <CircularProgress size={24} /> : "Sign Up as User"}
              </Button>

              <Divider sx={{ my: 2 }}>OR</Divider>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google signup failed")}
                text="signup_with"
                shape="rectangular"
                size="large"
                width="100%"
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/user/login")}
                    sx={{ textDecoration: "none" }}
                  >
                    Login as User
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Want to list workspaces?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/admin/signup")}
                    sx={{ textDecoration: "none" }}
                  >
                    Admin Signup
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

export default UserSignup;
