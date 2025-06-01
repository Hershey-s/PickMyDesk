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

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

    try {
      const response = await axios.post(`${baseURL}/login`, {
        ...formData,
        expectedRole: "admin", // Ensure only admins can login here
      });

      if (response.data.user.role !== "admin") {
        setError("Access denied. This login is for workspace owners only.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Admin login error:", error);
      setError(error.response?.data?.message || "Login failed");
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

      if (response.data.user.role !== "admin") {
        setError("Access denied. This login is for workspace owners only.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Google admin login error:", error);
      setError(error.response?.data?.message || "Google login failed");
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
              Admin Login
            </Typography>
          </Box>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Login to manage workspaces
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Admin Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
              />

              <TextField
                label="Admin Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
              />

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
                startIcon={<AdminPanelSettingsIcon />}
              >
                {loading ? <CircularProgress size={24} /> : "Login as Admin"}
              </Button>

              <Divider sx={{ my: 2 }}>OR</Divider>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google admin login failed")}
                text="signin_with"
                shape="rectangular"
                size="large"
                width="100%"
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Don't have an admin account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/admin/signup")}
                    sx={{ textDecoration: "none" }}
                  >
                    Sign up as Admin
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Are you a workspace booker?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/user/login")}
                    sx={{ textDecoration: "none" }}
                  >
                    User Login
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

export default AdminLogin;
