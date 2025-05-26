import express from "express";
import {
  createBooking,
  getUserBookings,
  getWorkspaceBookings,
  getBookingById,
  updateBookingStatus,
  rescheduleBooking,
  checkAvailability
} from "../controllers/booking.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";
import WrapAsync from "../utils/WrapAsync.js";
import { validateBooking } from "../utils/validation.js";

const bookingRouter = express.Router();

// Create a new booking (requires authentication)
bookingRouter.post("/bookings", verifyToken, validateBooking, WrapAsync(createBooking));

// Get user's bookings (requires authentication)
bookingRouter.get("/bookings/user", verifyToken, WrapAsync(getUserBookings));

// Get bookings for a specific workspace (workspace owner only)
bookingRouter.get("/bookings/workspace/:workspaceId", verifyToken, WrapAsync(getWorkspaceBookings));

// Update booking status (requires authentication) - MOVED UP
bookingRouter.put("/bookings/:bookingId/status", verifyToken, WrapAsync(updateBookingStatus));

// Reschedule booking (requires authentication) - MOVED UP
bookingRouter.put("/bookings/:bookingId/reschedule", verifyToken, WrapAsync(rescheduleBooking));



// Get specific booking by ID (requires authentication) - MOVED DOWN
bookingRouter.get("/bookings/:bookingId", verifyToken, WrapAsync(getBookingById));

// Check availability for a workspace (public)
bookingRouter.get("/workspaces/:workspaceId/availability", WrapAsync(checkAvailability));

export default bookingRouter;
