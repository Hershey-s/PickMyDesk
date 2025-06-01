import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Alert,
  Chip,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const AdminWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5007";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== "admin") {
        navigate("/user/login");
        return;
      }
      setUser(parsedUser);
      fetchWorkspaces();
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  const fetchWorkspaces = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      const response = await axios.get(`${baseURL}/workspaces`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Get all workspaces (for now, show all - we'll filter by admin later if needed)
      const allWorkspaces = response.data.workspaces || response.data || [];

      console.log("📋 All workspaces:", allWorkspaces);
      console.log("👤 Current user:", user);

      // For now, show all workspaces to debug
      setWorkspaces(allWorkspaces);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
      setError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      console.log("🗑️ Deleting workspace:", workspaceId);

      const response = await axios.delete(
        `${baseURL}/workspaces/${workspaceId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Workspace deleted successfully:", response.data);

      // Remove the deleted workspace from the state
      setWorkspaces(workspaces.filter((ws) => ws._id !== workspaceId));

      // Show success message
      setError(""); // Clear any previous errors
    } catch (error) {
      console.error("❌ Error deleting workspace:", error);
      setError(error.response?.data?.message || "Failed to delete workspace");
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>Loading workspaces...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            My Workspaces
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your workspace listings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/new")}
        >
          Create New Workspace
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {workspaces.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No workspaces found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first workspace to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/new")}
          >
            Create Workspace
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {workspaces.map((workspace) => (
            <Grid item xs={12} md={6} lg={4} key={workspace._id}>
              <Card sx={{ height: "100%" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    workspace.listingImage ||
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500"
                  }
                  alt={workspace.title}
                />
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {workspace.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    📍 {workspace.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {workspace.description?.substring(0, 100)}...
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" color="primary">
                      ₹{workspace.price}/{workspace.priceUnit || "day"}
                    </Typography>
                    <Chip
                      label={workspace.isPopular ? "Popular" : "Standard"}
                      color={workspace.isPopular ? "primary" : "default"}
                      size="small"
                    />
                  </Box>

                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/workspace/edit/${workspace._id}`)
                      }
                      title="Edit Workspace"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${workspace.title}"? This action cannot be undone.`
                          )
                        ) {
                          handleDeleteWorkspace(workspace._id);
                        }
                      }}
                      title="Delete Workspace"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4, p: 3, bgcolor: "grey.100", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Workspace Management Tips
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Keep your workspace descriptions detailed and accurate
          <br />
          • Upload high-quality photos to attract more bookings
          <br />
          • Update pricing and availability regularly
          <br />• Respond promptly to booking requests
        </Typography>
      </Box>
    </Container>
  );
};

export default AdminWorkspaces;
