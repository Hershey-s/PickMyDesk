import mongoose from "mongoose";

const { Schema } = mongoose;

const bookingSchema = new Schema({
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workspace",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String, // Format: "09:00"
    required: function() {
      return this.workspace?.priceUnit === 'hour';
    }
  },
  endTime: {
    type: String, // Format: "17:00"
    required: function() {
      return this.workspace?.priceUnit === 'hour';
    }
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed"],
    default: "pending",
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed", "refunded"],
    default: "pending",
  },
  paymentIntentId: {
    type: String, // Stripe payment intent ID
  },
  guestCount: {
    type: Number,
    default: 1,
    min: 1,
  },
  specialRequests: {
    type: String,
    maxlength: 500,
  },
  contactInfo: {
    phone: String,
    phoneCountry: String, // ISO country code (e.g., 'in', 'us', 'gb')
    email: String,
  },
  cancellationReason: {
    type: String,
    maxlength: 200,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Indexes for efficient queries
bookingSchema.index({ workspace: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ status: 1 });

// Virtual for booking duration
bookingSchema.virtual('duration').get(function() {
  if (this.workspace?.priceUnit === 'hour' && this.startTime && this.endTime) {
    const start = new Date(`2000-01-01T${this.startTime}:00`);
    const end = new Date(`2000-01-01T${this.endTime}:00`);
    return Math.round((end - start) / (1000 * 60 * 60)); // hours
  } else {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // days
  }
});

// Pre-save middleware to update updatedAt
bookingSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if booking conflicts with existing bookings
bookingSchema.methods.hasConflict = async function() {
  try {
    const conflictQuery = {
      workspace: this.workspace,
      _id: { $ne: this._id }, // Exclude current booking
      status: { $in: ['pending', 'confirmed'] },
      // Check for date overlap
      startDate: { $lte: this.endDate },
      endDate: { $gte: this.startDate }
    };

    // For hourly bookings, also check time conflicts
    if (this.startTime && this.endTime) {
      conflictQuery.startTime = { $lt: this.endTime };
      conflictQuery.endTime = { $gt: this.startTime };
    }

    const conflictingBookings = await this.constructor.find(conflictQuery);

    console.log("🔍 Conflict check:", {
      workspace: this.workspace,
      dates: `${this.startDate} to ${this.endDate}`,
      times: this.startTime ? `${this.startTime} to ${this.endTime}` : 'N/A',
      conflictsFound: conflictingBookings.length
    });

    return conflictingBookings.length > 0;
  } catch (error) {
    console.error("Error checking conflicts:", error);
    return false; // If error, allow booking (can be changed based on requirements)
  }
};

// Static method to get availability for a workspace
bookingSchema.statics.getAvailability = async function(workspaceId, startDate, endDate) {
  const bookings = await this.find({
    workspace: workspaceId,
    status: { $in: ['pending', 'confirmed'] },
    $or: [
      {
        startDate: { $lte: endDate },
        endDate: { $gte: startDate }
      }
    ]
  }).sort({ startDate: 1 });

  return bookings;
};

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
