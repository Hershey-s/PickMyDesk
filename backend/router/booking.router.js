import express from "express";
import {
  createBooking,
  getUserBookings,
  getWorkspaceBookings,
  getBookingById,
  updateBookingStatus,
  rescheduleBooking,
  cancelBooking,
  checkAvailability,
} from "../controllers/booking.controller.js";
import {
  authenticateToken,
  requireUser,
  requireAdmin,
} from "../middlewares/authMiddleware.js"; // Import role-based auth
import WrapAsync from "../utils/WrapAsync.js";
import { validateBooking } from "../utils/validation.js";

const bookingRouter = express.Router();

// Create a new booking (Users only - cannot be done by admins)
bookingRouter.post(
  "/bookings",
  authenticateToken,
  requireUser,
  WrapAsync(createBooking)
);

// Get user's bookings (Users only)
bookingRouter.get(
  "/bookings/user",
  authenticateToken,
  requireUser,
  WrapAsync(getUserBookings)
);

// Get bookings for a specific workspace (Admins only - workspace owners)
bookingRouter.get(
  "/bookings/workspace/:workspaceId",
  authenticateToken,
  requireAdmin,
  WrapAsync(getWorkspaceBookings)
);

// Update booking status (Admins only - workspace owners can manage bookings)
bookingRouter.put(
  "/bookings/:bookingId/status",
  authenticateToken,
  requireAdmin,
  WrapAsync(updateBookingStatus)
);

// Cancel booking (Users can cancel their own bookings)
bookingRouter.put(
  "/bookings/:bookingId/cancel",
  authenticateToken,
  requireUser,
  WrapAsync(cancelBooking)
);

// Reschedule booking (Users only - users can reschedule their own bookings)
bookingRouter.put(
  "/bookings/:bookingId/reschedule",
  authenticateToken,
  requireUser,
  WrapAsync(rescheduleBooking)
);

// Get specific booking by ID (Users only - users can view their bookings)
bookingRouter.get(
  "/bookings/:bookingId",
  authenticateToken,
  requireUser,
  WrapAsync(getBookingById)
);

// Check availability for a workspace (public)
bookingRouter.get(
  "/workspaces/:workspaceId/availability",
  WrapAsync(checkAvailability)
);

export default bookingRouter;
