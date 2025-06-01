import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Paper,
} from "@mui/material";
import axios from "axios";

const EditWorkspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    country: "India",
    price: "",
    priceUnit: "day",
    currency: "INR",
    maxCapacity: 5,
    isPopular: false,
    instantBooking: true,
    cancellationPolicy: "flexible",
    minimumBookingDuration: 1,
    tags: "",
    amenities: "",
  });

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5007";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/admin/login");
      return;
    }

    const user = JSON.parse(userData);
    if (user.role !== "admin") {
      navigate("/user/login");
      return;
    }

    fetchWorkspace();
  }, [id, navigate]);

  const fetchWorkspace = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      console.log("🔍 Fetching workspace for edit:", id);
      const response = await axios.get(`${baseURL}/workspaces/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const workspace = response.data;
      console.log("✅ Workspace data:", workspace);

      setFormData({
        title: workspace.title || "",
        description: workspace.description || "",
        location: workspace.location || "",
        country: workspace.country || "India",
        price: workspace.price || "",
        priceUnit: workspace.priceUnit || "day",
        currency: workspace.currency || "INR",
        maxCapacity: workspace.maxCapacity || 5,
        isPopular: workspace.isPopular || false,
        instantBooking: workspace.instantBooking !== false,
        cancellationPolicy: workspace.cancellationPolicy || "flexible",
        minimumBookingDuration: workspace.minimumBookingDuration || 1,
        tags: Array.isArray(workspace.tags) ? workspace.tags.join(", ") : "",
        amenities: Array.isArray(workspace.amenities) ? workspace.amenities.join(", ") : "",
      });

    } catch (error) {
      console.error("❌ Error fetching workspace:", error);
      setError("Failed to load workspace details");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/admin/login");
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        maxCapacity: parseInt(formData.maxCapacity),
        minimumBookingDuration: parseInt(formData.minimumBookingDuration),
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag),
        amenities: formData.amenities.split(",").map(amenity => amenity.trim()).filter(amenity => amenity),
      };

      console.log("📤 Updating workspace:", submitData);

      const response = await axios.put(`${baseURL}/workspaces/${id}`, submitData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      console.log("✅ Workspace updated:", response.data);
      setSuccess("Workspace updated successfully!");
      
      // Redirect back to admin workspaces after 2 seconds
      setTimeout(() => {
        navigate("/admin/workspaces");
      }, 2000);

    } catch (error) {
      console.error("❌ Error updating workspace:", error);
      setError(error.response?.data?.message || "Failed to update workspace");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading workspace details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Workspace
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update your workspace details below
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Workspace Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  label="Country"
                >
                  <MenuItem value="India">India</MenuItem>
                  <MenuItem value="USA">USA</MenuItem>
                  <MenuItem value="UK">UK</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Price Unit</InputLabel>
                <Select
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleInputChange}
                  label="Price Unit"
                >
                  <MenuItem value="hour">Per Hour</MenuItem>
                  <MenuItem value="day">Per Day</MenuItem>
                  <MenuItem value="week">Per Week</MenuItem>
                  <MenuItem value="month">Per Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Max Capacity"
                name="maxCapacity"
                type="number"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                inputProps={{ min: 1, max: 50 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g., WiFi, Coffee, Meeting Room"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amenities (comma-separated)"
                name="amenities"
                value={formData.amenities}
                onChange={handleInputChange}
                placeholder="e.g., Air Conditioning, Parking, Kitchen"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isPopular}
                    onChange={handleInputChange}
                    name="isPopular"
                  />
                }
                label="Mark as Popular"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.instantBooking}
                    onChange={handleInputChange}
                    name="instantBooking"
                  />
                }
                label="Allow Instant Booking"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate("/admin/workspaces")}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={saving}
                >
                  {saving ? <CircularProgress size={24} /> : "Update Workspace"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default EditWorkspace;
