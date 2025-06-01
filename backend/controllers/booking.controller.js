import Booking from "../models/booking.model.js";
import Workspace from "../models/workspace.model.js";
import User from "../models/userReg.model.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    console.log("🔄 Creating booking...");
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const {
      workspaceId,
      startDate,
      endDate,
      startTime,
      endTime,
      guestCount,
      specialRequests,
      contactInfo,
    } = req.body;

    const userId = req.user.userId;
    console.log("User ID:", userId);
    console.log("Workspace ID:", workspaceId);

    // Validate workspace exists
    console.log("🔍 Looking for workspace...");
    const workspace = await Workspace.findById(workspaceId);
    console.log("Workspace found:", !!workspace);
    if (!workspace) {
      console.log("❌ Workspace not found");
      return res.status(404).json({ message: "Workspace not found" });
    }
    console.log("✅ Workspace found:", workspace.title);

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res
        .status(400)
        .json({ message: "Start date cannot be in the past" });
    }

    if (end <= start) {
      return res
        .status(400)
        .json({ message: "End date must be after start date" });
    }

    // Calculate duration and total price
    let duration;
    if (workspace.priceUnit === "hour" && startTime && endTime) {
      const startHour = parseInt(startTime.split(":")[0]);
      const endHour = parseInt(endTime.split(":")[0]);
      duration = endHour - startHour;
    } else {
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    const totalPrice = duration * workspace.price;

    // Create booking
    const booking = new Booking({
      workspace: workspaceId,
      user: userId,
      startDate: start,
      endDate: end,
      startTime,
      endTime,
      totalPrice,
      guestCount: guestCount || 1,
      specialRequests,
      contactInfo,
      status: workspace.instantBooking ? "confirmed" : "pending",
    });

    // Check for conflicts
    const hasConflict = await booking.hasConflict();
    if (hasConflict) {
      return res.status(409).json({
        message:
          "This time slot is already booked. Please choose different dates/times.",
      });
    }

    await booking.save();

    // Populate workspace and user details
    await booking.populate([
      { path: "workspace", select: "title location price priceUnit" },
      { path: "user", select: "username email" },
    ]);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Create booking error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
      details: error.stack,
    });
  }
};

// Get all bookings for a user
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate(
        "workspace",
        "title location listingImage price priceUnit currency"
      )
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch bookings", error: error.message });
  }
};

// Get bookings for a workspace (for workspace owners)
export const getWorkspaceBookings = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user.userId;

    // Verify user owns the workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      owner: userId,
    });
    if (!workspace) {
      return res
        .status(403)
        .json({ message: "Access denied. You don't own this workspace." });
    }

    const bookings = await Booking.find({ workspace: workspaceId })
      .populate("user", "username email")
      .sort({ startDate: 1 });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error("Get workspace bookings error:", error);
    res
      .status(500)
      .json({
        message: "Failed to fetch workspace bookings",
        error: error.message,
      });
  }
};

// Get booking by ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.userId;

    const booking = await Booking.findById(bookingId)
      .populate(
        "workspace",
        "title location listingImage price priceUnit owner"
      )
      .populate("user", "username email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user is the booking owner or workspace owner
    if (
      booking.user._id.toString() !== userId &&
      booking.workspace.owner.toString() !== userId
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ booking });
  } catch (error) {
    console.error("Get booking error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch booking", error: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    console.log("🔄 Update booking status request:", {
      bookingId: req.params.bookingId,
      body: req.body,
      userId: req.user.userId,
    });

    const { bookingId } = req.params;
    const { status, cancellationReason } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const booking = await Booking.findById(bookingId).populate("workspace");
    if (!booking) {
      console.log("❌ Booking not found:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("📝 Found booking:", {
      id: booking._id,
      currentStatus: booking.status,
      user: booking.user,
      workspace: booking.workspace?._id,
    });

    // Check permissions - simplified for booking owner
    const isBookingOwner = booking.user.toString() === userId;
    console.log("🔐 Permission check:", {
      bookingUser: booking.user.toString(),
      currentUser: userId,
      isBookingOwner,
    });

    if (!isBookingOwner) {
      // Only check workspace owner if workspace exists and has owner
      if (booking.workspace && booking.workspace.owner) {
        const isWorkspaceOwner = booking.workspace.owner.toString() === userId;
        if (!isWorkspaceOwner) {
          console.log("❌ Access denied - not booking or workspace owner");
          return res.status(403).json({ message: "Access denied" });
        }
      } else {
        console.log(
          "❌ Access denied - not booking owner and no workspace owner"
        );
        return res.status(403).json({ message: "Access denied" });
      }
    }

    // Validate status transitions
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["cancelled", "completed"],
      cancelled: [], // Cannot change from cancelled
      completed: [], // Cannot change from completed
    };

    if (
      !validTransitions[booking.status] ||
      !validTransitions[booking.status].includes(status)
    ) {
      console.log("❌ Invalid status transition:", {
        from: booking.status,
        to: status,
        validOptions: validTransitions[booking.status],
      });
      return res.status(400).json({
        message: `Cannot change status from ${booking.status} to ${status}`,
        validTransitions: validTransitions[booking.status],
      });
    }

    // Update booking
    console.log(
      "✅ Updating booking status from",
      booking.status,
      "to",
      status
    );
    booking.status = status;
    if (status === "cancelled" && cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    const updatedBooking = await booking.save();
    console.log("✅ Booking updated successfully:", updatedBooking._id);

    res.status(200).json({
      message: "Booking status updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("❌ Update booking status error:", error);
    res.status(500).json({
      message: "Failed to update booking status",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Reschedule a booking
export const rescheduleBooking = async (req, res) => {
  try {
    console.log("🔄 Reschedule booking request:", {
      bookingId: req.params.bookingId,
      body: req.body,
      userId: req.user.userId,
    });

    const { bookingId } = req.params;
    const { startDate, endDate, startTime, endTime } = req.body;
    const userId = req.user.userId;

    // Validate required fields
    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const booking = await Booking.findById(bookingId).populate("workspace");
    if (!booking) {
      console.log("❌ Booking not found:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("📝 Found booking for reschedule:", {
      id: booking._id,
      currentStatus: booking.status,
      user: booking.user,
      workspace: booking.workspace?._id,
    });

    // Check if user owns the booking
    if (booking.user.toString() !== userId) {
      console.log("❌ Access denied - not booking owner");
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if booking can be rescheduled
    if (booking.status === "cancelled" || booking.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot reschedule cancelled or completed bookings" });
    }

    // Check if new dates are in the future
    const newStart = new Date(startDate);
    const now = new Date();
    if (newStart < now) {
      return res
        .status(400)
        .json({ message: "New start date cannot be in the past" });
    }

    // Check for conflicts with new dates/times (excluding current booking)
    const conflictingBookings = await Booking.find({
      _id: { $ne: bookingId }, // Exclude current booking
      workspace: booking.workspace._id,
      status: { $in: ["confirmed", "pending"] },
      $or: [
        {
          $and: [
            { startDate: { $lte: new Date(endDate) } },
            { endDate: { $gte: new Date(startDate) } },
          ],
        },
      ],
    });

    // For hourly bookings, check time conflicts
    if (
      booking.workspace.priceUnit === "hour" &&
      startTime &&
      endTime &&
      conflictingBookings.length > 0
    ) {
      const timeConflicts = conflictingBookings.filter((b) => {
        if (b.startTime && b.endTime) {
          return startTime < b.endTime && endTime > b.startTime;
        }
        return true;
      });

      if (timeConflicts.length > 0) {
        return res.status(409).json({
          message: "The new time slot is already booked",
        });
      }
    } else if (conflictingBookings.length > 0) {
      return res.status(409).json({
        message: "The new dates are already booked",
      });
    }

    // Calculate new total price
    let duration;
    if (booking.workspace.priceUnit === "hour" && startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      duration = (end - start) / (1000 * 60 * 60);
    } else {
      const start = new Date(startDate);
      const end = new Date(endDate);
      duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    }

    const newTotalPrice = duration * booking.workspace.price;

    // Update booking
    booking.startDate = new Date(startDate);
    booking.endDate = new Date(endDate);
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.totalPrice = newTotalPrice;
    booking.updatedAt = new Date();

    await booking.save();

    // TODO: Send reschedule confirmation email
    // await sendBookingRescheduleEmail(booking);

    res.status(200).json({
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    console.error("Reschedule booking error:", error);
    res
      .status(500)
      .json({ message: "Failed to reschedule booking", error: error.message });
  }
};

// Cancel a booking (Users can cancel their own bookings)
export const cancelBooking = async (req, res) => {
  try {
    console.log("🚫 Cancel booking request:", {
      bookingId: req.params.bookingId,
      userId: req.user.userId,
      body: req.body,
    });

    const { bookingId } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user.userId;

    const booking = await Booking.findById(bookingId).populate("workspace");
    if (!booking) {
      console.log("❌ Booking not found:", bookingId);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("📝 Found booking for cancellation:", {
      id: booking._id,
      currentStatus: booking.status,
      user: booking.user,
      workspace: booking.workspace?._id,
    });

    // Check if user owns the booking
    if (booking.user.toString() !== userId) {
      console.log("❌ Access denied - not booking owner");
      return res
        .status(403)
        .json({
          message: "Access denied. You can only cancel your own bookings.",
        });
    }

    // Check if booking can be cancelled
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ message: "Cannot cancel completed bookings" });
    }

    // Update booking status to cancelled
    console.log("✅ Cancelling booking:", booking._id);
    booking.status = "cancelled";
    if (cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }
    booking.updatedAt = new Date();

    const updatedBooking = await booking.save();
    console.log("✅ Booking cancelled successfully:", updatedBooking._id);

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    console.error("❌ Cancel booking error:", error);
    res.status(500).json({
      message: "Failed to cancel booking",
      error: error.message,
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// Check availability for a workspace
export const checkAvailability = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { startDate, endDate, startTime, endTime } = req.query;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Get existing bookings for the date range
    const existingBookings = await Booking.getAvailability(
      workspaceId,
      start,
      end
    );

    // Check if the specific time slot is available
    let isAvailable = true;
    let conflictingBookings = [];

    for (const booking of existingBookings) {
      // Check date overlap
      if (booking.startDate <= end && booking.endDate >= start) {
        // If it's hourly booking, also check time overlap
        if (
          workspace.priceUnit === "hour" &&
          startTime &&
          endTime &&
          booking.startTime &&
          booking.endTime
        ) {
          if (booking.startTime < endTime && booking.endTime > startTime) {
            isAvailable = false;
            conflictingBookings.push(booking);
          }
        } else {
          isAvailable = false;
          conflictingBookings.push(booking);
        }
      }
    }

    res.status(200).json({
      available: isAvailable,
      conflictingBookings: conflictingBookings.map((b) => ({
        startDate: b.startDate,
        endDate: b.endDate,
        startTime: b.startTime,
        endTime: b.endTime,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error("Check availability error:", error);
    res
      .status(500)
      .json({ message: "Failed to check availability", error: error.message });
  }
};
