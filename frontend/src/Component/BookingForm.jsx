import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { formatPrice } from "../utils/currency";
import { generateTimeOptionsWithAMPM } from "../utils/timeFormat";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function BookingForm({ workspace }) {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    startTime: "09:00", // Default to 09:00 (9:00 AM)
    endTime: "17:00", // Default to 17:00 (5:00 PM)
    guestCount: 1,
    specialRequests: "",
    contactInfo: {
      phone: "",
      phoneCountry: "in", // Default to India
      email: "",
    },
  });

  // Check for URL parameters to pre-fill date and time
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const preSelectedDate = urlParams.get("date");
    const preSelectedTime = urlParams.get("time");

    if (preSelectedDate || preSelectedTime) {
      setFormData((prev) => ({
        ...prev,
        startDate: preSelectedDate || prev.startDate,
        endDate: preSelectedDate || prev.endDate,
        startTime: preSelectedTime || prev.startTime,
      }));
    }
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [availability, setAvailability] = useState(null);

  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5004";

  // Calculate total price when dates/times change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      calculatePrice();
    }
  }, [
    formData.startDate,
    formData.endDate,
    formData.startTime,
    formData.endTime,
  ]);

  const calculatePrice = () => {
    if (!workspace) return;

    let duration = 0;

    if (
      workspace.priceUnit === "hour" &&
      formData.startTime &&
      formData.endTime
    ) {
      const startHour = parseInt(formData.startTime.split(":")[0]);
      const endHour = parseInt(formData.endTime.split(":")[0]);
      duration = endHour - startHour;
    } else {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    setTotalPrice(duration * workspace.price);
  };

  const checkAvailability = async () => {
    if (!formData.startDate || !formData.endDate) return;

    try {
      const params = new URLSearchParams({
        startDate: formData.startDate,
        endDate: formData.endDate,
      });

      if (formData.startTime) params.append("startTime", formData.startTime);
      if (formData.endTime) params.append("endTime", formData.endTime);

      const response = await axios.get(
        `${baseURL}/workspaces/${workspace._id}/availability?${params}`
      );

      setAvailability(response.data);
    } catch (error) {
      console.error("Error checking availability:", error);
      setError("Failed to check availability");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePhoneChange = (value, country) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        phone: value,
        phoneCountry: country.countryCode,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem("token");
      console.log("🔑 Token check:", token ? "Token found" : "No token");

      if (!token) {
        setError("Please log in to make a booking");
        navigate("/login");
        return;
      }

      // Validate token format
      if (!token.includes(".")) {
        setError("Invalid token format. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      // Clean up form data - remove empty strings and convert types
      const cleanedData = {
        workspaceId: workspace._id,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guestCount: parseInt(formData.guestCount) || 1,
      };

      // Add optional fields only if they have values
      if (formData.startTime && formData.startTime.trim()) {
        cleanedData.startTime = formData.startTime;
      }
      if (formData.endTime && formData.endTime.trim()) {
        cleanedData.endTime = formData.endTime;
      }
      if (formData.specialRequests && formData.specialRequests.trim()) {
        cleanedData.specialRequests = formData.specialRequests;
      }

      // Add contact info only if provided
      const contactInfo = {};
      if (formData.contactInfo.phone && formData.contactInfo.phone.trim()) {
        contactInfo.phone = formData.contactInfo.phone;
        if (formData.contactInfo.phoneCountry) {
          contactInfo.phoneCountry = formData.contactInfo.phoneCountry;
        }
      }
      if (formData.contactInfo.email && formData.contactInfo.email.trim()) {
        contactInfo.email = formData.contactInfo.email;
      }
      if (Object.keys(contactInfo).length > 0) {
        cleanedData.contactInfo = contactInfo;
      }

      console.log("📤 Sending booking data:", cleanedData);
      console.log("🔗 API URL:", `${baseURL}/bookings`);
      console.log(
        "🔑 Authorization header:",
        `Bearer ${token.substring(0, 20)}...`
      );

      const response = await axios.post(`${baseURL}/bookings`, cleanedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Booking response:", response.data);
      setSuccess("Booking created successfully!");

      // Redirect to bookings page after 2 seconds
      setTimeout(() => {
        navigate("/bookings");
      }, 2000);
    } catch (error) {
      console.error("❌ Booking error:", error);
      console.error("❌ Error response:", error.response?.data);

      if (error.response?.status === 401) {
        setError("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        setError("Access denied. Please check your account permissions.");
      } else {
        setError(
          error.response?.data?.message ||
            "Failed to create booking. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (!workspace) {
    return <Typography>Loading workspace details...</Typography>;
  }

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Book {workspace.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formatPrice(workspace.price, workspace.currency)} per{" "}
          {workspace.priceUnit}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <form onSubmit={handleSubmit}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Date Selection */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Start Date"
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                onBlur={checkAvailability}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: getTomorrowDate() }}
                required
                fullWidth
              />
              <TextField
                label="End Date"
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                onBlur={checkAvailability}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: formData.startDate || getTomorrowDate() }}
                required
                fullWidth
              />
            </Box>

            {/* Time Selection (always show for better user experience) */}
            {true && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Start Time (AM/PM)</InputLabel>
                    <Select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      label="Start Time (AM/PM)"
                    >
                      {generateTimeOptionsWithAMPM(false).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <FormControl fullWidth required>
                    <InputLabel>End Time (AM/PM)</InputLabel>
                    <Select
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                      label="End Time (AM/PM)"
                    >
                      {generateTimeOptionsWithAMPM(true).map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            )}

            {/* Guest Count */}
            <TextField
              label="Number of Guests"
              type="number"
              name="guestCount"
              value={formData.guestCount}
              onChange={handleInputChange}
              inputProps={{
                min: 1,
                max: 20, // Always allow up to 20 people
                step: 1,
              }}
              required
              fullWidth
              helperText="Maximum 20 people allowed"
            />

            {/* Contact Information */}
            <Box>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Phone Number (with country code)
              </Typography>
              <PhoneInput
                country={formData.contactInfo.phoneCountry}
                value={formData.contactInfo.phone}
                onChange={handlePhoneChange}
                inputStyle={{
                  width: "100%",
                  height: "56px",
                  fontSize: "16px",
                  border: "1px solid #c4c4c4",
                  borderRadius: "4px",
                  paddingLeft: "48px",
                }}
                containerStyle={{
                  width: "100%",
                }}
                buttonStyle={{
                  border: "1px solid #c4c4c4",
                  borderRadius: "4px 0 0 4px",
                }}
                dropdownStyle={{
                  maxHeight: "150px",
                }}
                searchStyle={{
                  margin: "0",
                  width: "97%",
                  height: "30px",
                }}
                enableSearch={true}
                disableSearchIcon={true}
                placeholder="Enter phone number"
                preferredCountries={["in", "us", "gb", "ca", "au"]}
                priority={{
                  in: 0,
                  us: 1,
                  gb: 2,
                  ca: 3,
                  au: 4,
                }}
              />
            </Box>

            <TextField
              label="Email"
              type="email"
              name="contactInfo.email"
              value={formData.contactInfo.email}
              onChange={handleInputChange}
              fullWidth
            />

            {/* Special Requests */}
            <TextField
              label="Special Requests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />

            {/* Availability Status */}
            {availability && (
              <Alert severity={availability.available ? "success" : "error"}>
                {availability.available
                  ? "✅ Available for booking!"
                  : "❌ Not available for selected dates/times"}
              </Alert>
            )}

            {/* Total Price */}
            {totalPrice > 0 && (
              <Box sx={{ p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography variant="h6">
                  Total: {formatPrice(totalPrice, workspace.currency)}
                </Typography>
              </Box>
            )}

            {/* Error/Success Messages */}
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || (availability && !availability.available)}
              sx={{ mt: 2 }}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                `Book Now - ${formatPrice(totalPrice, workspace.currency)}`
              )}
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  );
}
