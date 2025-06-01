import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import BookingIcon from "@mui/icons-material/EventNote";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        navigate("/user/login");
        return;
      }
      setUser(parsedUser);
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user.username}!
          </Typography>
        </Box>
        <Button variant="outlined" onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          <strong>Admin Account:</strong> You can create and manage workspaces, but you cannot book them. 
          Booking functionality is only available for user accounts.
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", cursor: "pointer" }} onClick={() => navigate("/new")}>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <AddIcon sx={{ fontSize: 60, color: "primary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Create New Workspace
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Add a new workspace to your portfolio
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />}>
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", cursor: "pointer" }} onClick={() => navigate("/admin/workspaces")}>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <BusinessIcon sx={{ fontSize: 60, color: "secondary.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Manage Workspaces
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                View and edit your existing workspaces
              </Typography>
              <Button variant="contained" color="secondary" startIcon={<BusinessIcon />}>
                View Workspaces
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", cursor: "pointer" }} onClick={() => navigate("/admin/bookings")}>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <BookingIcon sx={{ fontSize: 60, color: "success.main", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Manage Bookings
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                View and manage workspace bookings
              </Typography>
              <Button variant="contained" color="success" startIcon={<BookingIcon />}>
                View Bookings
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent sx={{ textAlign: "center", p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Quick Stats
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Coming soon: Analytics and insights
              </Typography>
              <Typography variant="h6" color="primary">
                📊 Analytics Dashboard
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, p: 3, bgcolor: "grey.100", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Getting Started
        </Typography>
        <Typography variant="body2" color="text.secondary">
          1. Create your first workspace using the "Create New Workspace" option<br />
          2. Add detailed descriptions, photos, and pricing<br />
          3. Monitor bookings and manage your workspace portfolio<br />
          4. Users will be able to discover and book your workspaces
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboard;
