import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { formatPrice } from "../../utils/currency";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";

export default function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelDialog, setCancelDialog] = useState({ open: false, booking: null });
  const [cancellationReason, setCancellationReason] = useState("");
  const [rescheduleDialog, setRescheduleDialog] = useState({ open: false, booking: null });
  const [rescheduleData, setRescheduleData] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: ''
  });

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${baseURL}/bookings/user`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setBookings(response.data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      console.log("🔄 Starting cancel booking process...");
      const token = localStorage.getItem("token");
      const { booking } = cancelDialog;

      if (!token) {
        setError("Please log in to cancel booking");
        return;
      }

      if (!booking || !booking._id) {
        setError("Invalid booking data");
        return;
      }

      console.log("📝 Cancelling booking:", booking._id);
      console.log("🔗 API URL:", `${baseURL}/bookings/${booking._id}/status`);

      const response = await axios.put(
        `${baseURL}/bookings/${booking._id}/status`,
        {
          status: "cancelled",
          cancellationReason
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Cancel response:", response.data);

      // Update local state
      setBookings(prev =>
        prev.map(b =>
          b._id === booking._id
            ? { ...b, status: "cancelled", cancellationReason }
            : b
        )
      );

      setCancelDialog({ open: false, booking: null });
      setCancellationReason("");
      setError(""); // Clear any previous errors

      // Show success message
      alert("Booking cancelled successfully!");

    } catch (error) {
      console.error("❌ Error cancelling booking:", error);
      console.error("❌ Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
      setError("Failed to cancel booking: " + errorMessage);
      alert("Failed to cancel booking: " + errorMessage);
    }
  };

  const handleRescheduleBooking = async () => {
    try {
      console.log("🔄 Starting reschedule booking process...");
      const token = localStorage.getItem("token");
      const { booking } = rescheduleDialog;

      if (!token) {
        setError("Please log in to reschedule booking");
        return;
      }

      if (!booking || !booking._id) {
        setError("Invalid booking data");
        return;
      }

      // Validate required fields
      if (!rescheduleData.startDate || !rescheduleData.endDate) {
        setError("Please select start and end dates");
        return;
      }

      console.log("📝 Rescheduling booking:", booking._id);
      console.log("📅 New schedule data:", rescheduleData);
      console.log("🔗 API URL:", `${baseURL}/bookings/${booking._id}/reschedule`);

      const response = await axios.put(
        `${baseURL}/bookings/${booking._id}/reschedule`,
        rescheduleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ Reschedule response:", response.data);

      // Update local state with the updated booking
      setBookings(prev =>
        prev.map(b =>
          b._id === booking._id ? response.data.booking : b
        )
      );

      setRescheduleDialog({ open: false, booking: null });
      setRescheduleData({ startDate: '', endDate: '', startTime: '', endTime: '' });
      setError(""); // Clear any previous errors

      // Show success message
      alert("Booking rescheduled successfully!");

    } catch (error) {
      console.error("❌ Error rescheduling booking:", error);
      console.error("❌ Error response:", error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error occurred";
      setError("Failed to reschedule booking: " + errorMessage);
      alert("Failed to reschedule booking: " + errorMessage);
    }
  };

  const openRescheduleDialog = (booking) => {
    // Pre-fill with current booking data
    setRescheduleData({
      startDate: booking.startDate.split('T')[0],
      endDate: booking.endDate.split('T')[0],
      startTime: booking.startTime || '',
      endTime: booking.endTime || ''
    });
    setRescheduleDialog({ open: true, booking });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "success";
      case "pending": return "warning";
      case "cancelled": return "error";
      case "completed": return "info";
      default: return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {bookings.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No bookings found
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => navigate("/")}
          >
            Browse Workspaces
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {bookings.map((booking) => {
            // Add null checks for workspace data
            const workspace = booking.workspace || {};
            const workspaceTitle = workspace.title || 'Unknown Workspace';
            const workspaceLocation = workspace.location || 'Unknown Location';
            const workspaceImage = workspace.listingImage || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500';
            const workspaceCurrency = workspace.currency || 'INR';

            return (
              <Grid item xs={12} md={6} lg={4} key={booking._id}>
                <Card sx={{ height: "100%" }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={workspaceImage}
                    alt={workspaceTitle}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {workspaceTitle}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      📍 {workspaceLocation}
                    </Typography>

                  <Box sx={{ my: 2 }}>
                    <Typography variant="body2">
                      <strong>Dates:</strong> {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                    </Typography>

                    {booking.startTime && booking.endTime && (
                      <Typography variant="body2">
                        <strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </Typography>
                    )}

                    <Typography variant="body2">
                      <strong>Guests:</strong> {booking.guestCount}
                    </Typography>

                    <Typography variant="body2">
                      <strong>Total:</strong> {formatPrice(booking.totalPrice, workspaceCurrency)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Chip
                      label={booking.status.toUpperCase()}
                      color={getStatusColor(booking.status)}
                      size="small"
                    />
                  </Box>

                  {booking.status === "confirmed" && (
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={() => openRescheduleDialog(booking)}
                      >
                        Reschedule
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => setCancelDialog({ open: true, booking })}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}

                  {booking.specialRequests && (
                    <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                      Note: {booking.specialRequests}
                    </Typography>
                  )}

                  {booking.contactInfo?.phone && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      📞 {booking.contactInfo.phone}
                    </Typography>
                  )}

                  {booking.cancellationReason && (
                    <Typography variant="body2" sx={{ mt: 1, color: "error.main" }}>
                      Cancelled: {booking.cancellationReason}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
            );
          })}
        </Grid>
      )}

      {/* Cancel Booking Dialog */}
      <Dialog
        open={cancelDialog.open}
        onClose={() => setCancelDialog({ open: false, booking: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Are you sure you want to cancel your booking for "{cancelDialog.booking?.workspace?.title || 'this workspace'}"?
          </Typography>
          <TextField
            label="Reason for cancellation (optional)"
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog({ open: false, booking: null })}>
            Keep Booking
          </Button>
          <Button onClick={handleCancelBooking} color="error" variant="contained">
            Cancel Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reschedule Booking Dialog */}
      <Dialog
        open={rescheduleDialog.open}
        onClose={() => setRescheduleDialog({ open: false, booking: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reschedule Booking</DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ mb: 3 }}>
            Reschedule your booking for "{rescheduleDialog.booking?.workspace?.title || 'this workspace'}"
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Start Date"
              type="date"
              value={rescheduleData.startDate}
              onChange={(e) => setRescheduleData(prev => ({ ...prev, startDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="End Date"
              type="date"
              value={rescheduleData.endDate}
              onChange={(e) => setRescheduleData(prev => ({ ...prev, endDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Box>

          {rescheduleDialog.booking?.workspace?.priceUnit === 'hour' && (
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Start Time"
                type="time"
                value={rescheduleData.startTime}
                onChange={(e) => setRescheduleData(prev => ({ ...prev, startTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
              <TextField
                label="End Time"
                type="time"
                value={rescheduleData.endTime}
                onChange={(e) => setRescheduleData(prev => ({ ...prev, endTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
              />
            </Box>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Note: Rescheduling may affect the total price based on availability and pricing changes.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRescheduleDialog({ open: false, booking: null })}>
            Cancel
          </Button>
          <Button
            onClick={handleRescheduleBooking}
            color="primary"
            variant="contained"
            disabled={!rescheduleData.startDate || !rescheduleData.endDate}
          >
            Reschedule Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
