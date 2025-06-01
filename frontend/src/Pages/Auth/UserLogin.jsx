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

const UserLogin = () => {
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
        expectedRole: "user", // Ensure only users can login here
      });

      if (response.data.user.role !== "user") {
        setError("Access denied. This login is for workspace bookers only.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      console.log("✅ Login successful, stored data:", {
        token: !!response.data.token,
        user: response.data.user,
      });

      // Force a page refresh to ensure navbar updates
      window.location.href = "/";
    } catch (error) {
      console.error("Login error:", error);
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
        expectedRole: "user",
      });

      if (response.data.user.role !== "user") {
        setError("Access denied. This login is for workspace bookers only.");
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
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
          <Typography variant="h4" align="center" gutterBottom color="primary">
            User Login
          </Typography>
          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Login to book workspaces
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
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

              {error && <Alert severity="error">{error}</Alert>}

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : "Login as User"}
              </Button>

              <Divider sx={{ my: 2 }}>OR</Divider>

              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={(error) => {
                  console.error("Google login error:", error);
                  setError("Google login failed. Please try again.");
                }}
                text="signin_with"
                shape="rectangular"
                size="large"
                width="100%"
                useOneTap={false}
                auto_select={false}
              />

              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/signup")}
                    sx={{ textDecoration: "none" }}
                  >
                    Sign up as User
                  </Link>
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Are you a workspace owner?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={() => navigate("/admin/login")}
                    sx={{ textDecoration: "none" }}
                  >
                    Admin Login
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

export default UserLogin;
