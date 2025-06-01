import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Chip,
  Breadcrumbs,
  CircularProgress,
  Alert,
} from "@mui/material";
import BookingForm from "../Component/BookingForm";
import { formatPrice } from "../utils/currency";
import { formatTimeWithAMPM } from "../utils/timeFormat";

export default function WorkspaceBooking() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5007";

  useEffect(() => {
    fetchWorkspaceDetails();
  }, [id]);

  const fetchWorkspaceDetails = async () => {
    try {
      const response = await axios.get(`${baseURL}/workspaces/${id}`);
      setWorkspace(response.data);
    } catch (error) {
      console.error("Error fetching workspace:", error);
      setError("Failed to load workspace details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!workspace) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Workspace not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          Home
        </Link>
        <Typography color="text.primary">Book Workspace</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Workspace Details */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardMedia
              component="img"
              height="300"
              image={workspace.listingImage}
              alt={workspace.title}
            />
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {workspace.title}
              </Typography>

              <Typography variant="h6" color="primary" gutterBottom>
                {formatPrice(workspace.price, workspace.currency || "INR")} per{" "}
                {workspace.priceUnit}
              </Typography>

              <Typography variant="body1" color="text.secondary" gutterBottom>
                📍 {workspace.location}, {workspace.country}
              </Typography>

              <Typography variant="body1" paragraph sx={{ mt: 2 }}>
                {workspace.description}
              </Typography>

              {/* Tags */}
              {workspace.tags && workspace.tags.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Features:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {workspace.tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Workspace Details */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Workspace Details:
                </Typography>

                {workspace.maxCapacity && (
                  <Typography variant="body2">
                    👥 Maximum Capacity: {workspace.maxCapacity} people
                  </Typography>
                )}

                {workspace.cancellationPolicy && (
                  <Typography variant="body2">
                    📋 Cancellation Policy: {workspace.cancellationPolicy}
                  </Typography>
                )}

                {workspace.instantBooking && (
                  <Typography variant="body2" color="success.main">
                    ⚡ Instant Booking Available
                  </Typography>
                )}

                {workspace.minimumBookingDuration && (
                  <Typography variant="body2">
                    ⏱️ Minimum Booking: {workspace.minimumBookingDuration}{" "}
                    {workspace.priceUnit}(s)
                  </Typography>
                )}
              </Box>

              {/* Amenities */}
              {workspace.amenities && workspace.amenities.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Amenities:
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {workspace.amenities.map((amenity, index) => (
                      <Chip
                        key={index}
                        label={amenity}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Availability Schedule */}
              {workspace.availability && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Operating Hours:
                  </Typography>
                  {Object.entries(workspace.availability).map(
                    ([day, schedule]) => (
                      <Typography key={day} variant="body2">
                        {day.charAt(0).toUpperCase() + day.slice(1)}:{" "}
                        {schedule.available
                          ? `${formatTimeWithAMPM(
                              schedule.start
                            )} - ${formatTimeWithAMPM(schedule.end)}`
                          : "Closed"}
                      </Typography>
                    )
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Booking Form */}
        <Grid item xs={12} md={5}>
          <BookingForm workspace={workspace} />
        </Grid>
      </Grid>
    </Container>
  );
}
